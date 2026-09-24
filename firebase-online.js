(function () {
  'use strict';

  const config = window.JIHOO_FIREBASE_CONFIG;
  let auth;
  let database;
  let sdk;
  let callbacks;
  let saveTimer;
  let lastSave = Promise.resolve();

  // UID는 8자리 숫자. 예전에 만든 4자리 UID 계정도 로그인은 계속 됩니다.
  const UID_PATTERN = /^(?:[1-9][0-9]{7}|[1-9][0-9]{3})$/;
  const PASSWORD_MIN = 6;   // Firebase 이메일/비밀번호 인증의 최소 길이
  const PASSWORD_MAX = 32;

  const codeEmail = code => `${code}@jihoo-battle.invalid`;
  // 10000000~99999999. 나머지 연산 편향이 생기지 않도록 범위 밖 값은 다시 뽑는다.
  const randomCode = () => {
    const limit = Math.floor(0x100000000 / 90000000) * 90000000;
    const buffer = new Uint32Array(1);
    do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
    return String(10000000 + buffer[0] % 90000000);
  };
  const status = message => { if (callbacks) callbacks.onStatus(message); };

  function checkPassword(password) {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN) throw new Error(`비밀번호는 ${PASSWORD_MIN}자 이상으로 정해 주세요.`);
    if (password.length > PASSWORD_MAX) throw new Error(`비밀번호는 ${PASSWORD_MAX}자 이하로 정해 주세요.`);
  }

  function code() {
    const match = auth && auth.currentUser && auth.currentUser.email &&
      auth.currentUser.email.match(/^([1-9][0-9]{7}|[1-9][0-9]{3})@jihoo-battle\.invalid$/);
    return match ? match[1] : null;
  }

  async function init(handlers) {
    callbacks = handlers;
    if (!config || !config.apiKey || !config.projectId || !config.appId || !config.authDomain) {
      status('온라인 설정 전 · 이 브라우저에만 기록됩니다');
      return;
    }
    try {
      const version = '12.19.0';
      const [appModule, authModule, firestoreModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`)
      ]);
      sdk = { ...authModule, ...firestoreModule };
      const app = appModule.initializeApp(config);
      auth = authModule.getAuth(app);
      database = firestoreModule.getFirestore(app);
      if (['localhost', '127.0.0.1'].includes(location.hostname) && window.JIHOO_FIREBASE_EMULATORS) {
        authModule.connectAuthEmulator(auth, window.JIHOO_FIREBASE_EMULATORS.auth, { disableWarnings: true });
        firestoreModule.connectFirestoreEmulator(database, window.JIHOO_FIREBASE_EMULATORS.host, window.JIHOO_FIREBASE_EMULATORS.port);
      }
      await auth.authStateReady();
      if (auth.currentUser) {
        if (!handlers.getProfile().nickname) await restoreCurrent();
        status(`온라인 연결됨 · UID ${code()}`);
      } else {
        status('온라인 미연결 · 계정을 만들거나 UID와 비밀번호로 로그인하세요');
      }
    } catch (error) {
      status('온라인 연결 실패 · Firebase 설정과 네트워크를 확인하세요');
    }
  }

  // 8자리 UID는 자동으로 배정하고, 비밀번호는 사용자가 직접 정한다.
  async function createAccount(password) {
    if (!auth) throw new Error('Firebase 연결을 먼저 확인하세요.');
    if (auth.currentUser) throw new Error('이미 온라인 계정에 연결되어 있습니다.');
    if (!callbacks.getProfile().nickname) throw new Error('닉네임을 먼저 정하세요.');
    checkPassword(password);
    for (let attempt = 0; attempt < 30; attempt++) {
      const privateCode = randomCode();
      try {
        await sdk.createUserWithEmailAndPassword(auth, codeEmail(privateCode), password);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') continue; // 이미 쓰는 UID면 다른 번호로 다시
        if (error.code === 'auth/weak-password') throw new Error(`비밀번호가 너무 약합니다. ${PASSWORD_MIN}자 이상으로 정해 주세요.`);
        if (error.code === 'auth/operation-not-allowed') throw new Error('이메일/비밀번호 로그인이 꺼져 있습니다. Firebase 인증 설정을 확인하세요.');
        if (error.code === 'auth/network-request-failed') throw new Error('네트워크 연결을 확인한 뒤 다시 시도하세요.');
        throw new Error('온라인 계정을 만들 수 없습니다. 인증 설정을 확인하세요.');
      }
      status(`온라인 연결됨 · UID ${privateCode}`);
      try {
        await saveNow();
        await publish();
      } catch (error) {
        return { code: privateCode, warning: '계정은 생성됐지만 초기 백업에 실패했습니다. UID를 보관하고 프로필의 "지금 백업"을 눌러 주세요.' };
      }
      return { code: privateCode };
    }
    throw new Error('사용 가능한 번호를 배정하지 못했습니다. 잠시 후 다시 시도하세요.');
  }

  // UID + 비밀번호로 로그인하고, 온라인 백업이 있으면 이 브라우저의 기록을 백업으로 바꾼다.
  async function login(privateCode, password) {
    if (!auth) throw new Error('Firebase 연결을 먼저 확인하세요.');
    if (!UID_PATTERN.test(privateCode) || !password) throw new Error('UID(8자리)와 비밀번호를 확인하세요.');
    clearTimeout(saveTimer);
    try {
      await sdk.signInWithEmailAndPassword(auth, codeEmail(privateCode), password);
    } catch (error) {
      if (error.code === 'auth/too-many-requests') throw new Error('시도가 너무 많습니다. 잠시 후 다시 로그인하세요.');
      if (error.code === 'auth/network-request-failed') throw new Error('네트워크 연결을 확인한 뒤 다시 시도하세요.');
      throw new Error('UID 또는 비밀번호가 올바르지 않습니다.');
    }
    let restored;
    try {
      restored = await restoreCurrent();
    } catch (error) {
      await sdk.signOut(auth);
      throw new Error('백업을 읽을 수 없습니다. Firebase 규칙과 연결을 확인하세요.');
    }
    if (!restored) {
      await sdk.signOut(auth);
      throw new Error('해당 UID의 온라인 백업이 없습니다.');
    }
    status(`온라인 연결됨 · UID ${privateCode}`);
  }

  // 로그인된 상태에서 비밀번호를 바꾼다. 현재 비밀번호로 한 번 더 확인한다.
  async function changePassword(currentPassword, newPassword) {
    if (!auth || !auth.currentUser) throw new Error('온라인 계정에 먼저 로그인하세요.');
    if (!currentPassword) throw new Error('현재 비밀번호를 입력하세요.');
    checkPassword(newPassword);
    if (newPassword === currentPassword) throw new Error('현재 비밀번호와 다른 비밀번호를 정해 주세요.');
    try {
      const credential = sdk.EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await sdk.reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      if (error.code === 'auth/too-many-requests') throw new Error('시도가 너무 많습니다. 잠시 후 다시 시도하세요.');
      if (error.code === 'auth/network-request-failed') throw new Error('네트워크 연결을 확인한 뒤 다시 시도하세요.');
      throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }
    try {
      await sdk.updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      if (error.code === 'auth/weak-password') throw new Error(`비밀번호가 너무 약합니다. ${PASSWORD_MIN}자 이상으로 정해 주세요.`);
      throw new Error('비밀번호를 바꾸지 못했습니다. 잠시 후 다시 시도하세요.');
    }
  }

  async function restoreCurrent() {
    if (!auth || !auth.currentUser) throw new Error('온라인 계정에 먼저 연결하세요.');
    const snapshot = await sdk.getDoc(sdk.doc(database, 'backups', auth.currentUser.uid));
    if (!snapshot.exists()) return false;
    const payload = JSON.parse(snapshot.data().payload);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('백업 데이터 형식이 올바르지 않습니다.');
    callbacks.onRestore(payload);
    return true;
  }

  async function saveNow() {
    if (!auth || !auth.currentUser) return;
    clearTimeout(saveTimer);
    const userId = auth.currentUser.uid;
    const payload = JSON.stringify(callbacks.getProfile());
    if (payload.length > 100000) throw new Error('백업 데이터가 너무 큽니다.');
    lastSave = lastSave.catch(() => {}).then(async () => {
      if (auth.currentUser?.uid !== userId) return;
      await sdk.setDoc(sdk.doc(database, 'backups', userId), {
        payload, updatedAt: sdk.serverTimestamp()
      });
      if (auth.currentUser?.uid === userId) status(`온라인 연결됨 · UID ${code()} · 백업 완료`);
    });
    return lastSave;
  }

  function queueSave() {
    if (!auth || !auth.currentUser) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveNow().catch(() => status('백업 실패 · 연결을 확인하고 다시 저장해 주세요')), 900);
  }

  async function publish() {
    if (!auth || !auth.currentUser) return;
    const profile = callbacks.getProfile();
    if (!profile.nickname) return;
    const counts = profile.useCount || {};
    const favorite = Object.keys(counts).filter(id => /^[a-z_]{1,24}$/.test(id))
      .sort((first, second) => counts[second] - counts[first])[0] || '';
    await sdk.setDoc(sdk.doc(database, 'leaderboard', auth.currentUser.uid), {
      nickname: profile.nickname,
      level: Math.min(100, Math.max(1, Number(callbacks.getLevel()) || 1)),
      deck: (profile.lastDeck || []).filter(id => /^[a-z_]{1,24}$/.test(id)).slice(0, 5),
      wins: Math.min(99999, Math.max(0, Math.floor(Number(profile.wins) || 0))),
      losses: Math.min(99999, Math.max(0, Math.floor(Number(profile.losses) || 0))),
      playMs: Math.min(315360000000, Math.max(0, Math.floor(Number(profile.playMs) || 0))),
      favorite, updatedAt: sdk.serverTimestamp()
    });
  }

  async function leaderboard() {
    if (!database) throw new Error('Firebase 연결 전에는 리더보드를 볼 수 없습니다.');
    const results = await sdk.getDocs(sdk.query(sdk.collection(database, 'leaderboard'), sdk.orderBy('level', 'desc'), sdk.limit(50)));
    return results.docs.map(entry => ({ id: entry.id, ...entry.data() }));
  }

  window.JihooOnline = { init, code, createAccount, login, recoverAccount: login, changePassword, restoreCurrent, saveNow, queueSave, publish, leaderboard,
    connected: () => !!(auth && auth.currentUser), enabled: () => !!auth };
})();
