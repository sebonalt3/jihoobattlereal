const CHARACTER_BALANCE = {
  fire: {
    hp: 2500, atk: 10, atkSpeed: 0.1, range: 180, speed: 110,
    burnDps: 100,
    burnDuration: 5
  },
  ice: {
    hp: 2000, atk: 100, atkSpeed: 1.5, range: 180, speed: 100,
    freezeChance: 0.35,
    freezeDuration: 1.6
  },
  lonely: {
    hp: 6500, atk: 140, atkSpeed: 1.0, range: 72, speed: 90,
    isMelee: true,
    loneRadius: 80,
    loneBonusHpFraction: 0.25
  },
  shield: {
    hp: 1250, shield: 2500, atk: 350, atkSpeed: 3, range: 72, speed: 80,
    isMelee: true,
    shieldDamageMultiplier: 0.7
  },
  assassin: {
    hp: 1600, atk: 300, atkSpeed: 0.6, range: 72, speed: 160,
    isMelee: true,
    teleportDelay: 2
  },
  combo: {
    hp: 2500, atk: 20, atkSpeed: 0.6, range: 270, speed: 120,
    comboBonusPerHit: 0.3
  },
  sniper: {
    hp: 1000, atk: 1500, atkSpeed: 7.0, range: 675, speed: 70
  },
  medic: {
    hp: 1750, atk: 0, atkSpeed: 3.0, range: 180, speed: 100,
    isHealer: true,
    fanAngleDeg: 160,
    fanRadius: 180,
    healAmount: 1200
  },
  awaken: {
    hp: 1250, atk: 50, atkSpeed: 1.0, range: 72, speed: 0.1,
    isMelee: true,
    awakenTime: 27,
    awakenStats: { hp: 8750, atk: 500, atkSpeed: 0.5, range: 225, speed: 100 }
  },
  berserk: {
    hp: 2750, atk: 250, atkSpeed: 1.2, range: 72, speed: 100,
    isMelee: true,
    berserk: true
  },
  poison: {
    hp: 1875, atk: 300, atkSpeed: 2.5, range: 180, speed: 100,
    poisonDps: 180,
    poisonDuration: 5,
    fanAngleDeg: 68.75493541569878,
    fanRadius: 180
  },
  charge: {
    hp: 3800, atk: 300, atkSpeed: 1.1, range: 72, speed: 100,
    chargeAtk: 1500,
    chargeMul: 2.5,
    chargeSpeed: 225,
    isMelee: true,
    skipHpMult: true,
    chargeDr: 0.25
  },
  stop: {
    hp: 4250, atk: 150, atkSpeed: 4, range: 135, speed: 90,
    isMelee: true
  },
  mutant: {
    hp: 750, atk: 70, atkSpeed: 2, range: 90, speed: 0.1, successRate: 0.35,
    mutantForms: {
      fail: { hp: 750, atk: 70, atkSpeed: 2, range: 90, speed: 0.1 },
      success: { hp: 5500, atk: 600, atkSpeed: 0.9, range: 90, speed: 100 }
    }
  },
  revive: {
    hp: 2250, atk: 60, atkSpeed: 1, range: 90, speed: 100,
    isReviver: true,
    reviveChance: 0.35,
    reviveHpFraction: 0.5
  },
  burning: {
    hp: 4000, atk: 0, atkSpeed: 0, range: 72, speed: 100,
    skipHpMult: true,
    contactBurn: { dps: 200, duration: 8 }
  },
  bat: {
    hp: 4750, atk: 350, atkSpeed: 2, range: 90, speed: 90,
    isMelee: true,
    fanAngleDeg: 120,
    fanRadius: 90
  },
  clock: {
    hp: 2400, atk: 250, atkSpeed: 1, range: 180, speed: 90,
    pulseInterval: 5,
    pulseRadiusPx: 180,
    allyAspdBonus: 0.08,
    enemyAspdPenalty: -0.08,
    buffDuration: 5
  },
  hmg: {
    hp: 1625, atk: 100, atkSpeed: 2, range: 283.5, speed: 80
  },
  mega: {
    hp: 2500, atk: 100, atkSpeed: 3, range: 270, speed: 90,
    pulseInterval: 10,
    pulseRadiusPx: 270,
    allyAtkBonus: 0.5,
    buffDuration: 4
  },
  rank: {
    hp: 3000, atk: 100, atkSpeed: 1.5, range: 72, speed: 100,
    isMelee: true
  },
  arcade: {
    hp: 3300, atk: 150, atkSpeed: 3.0, range: 72, speed: 95,
    isMelee: true
  },
  gumiho: {
    hp: 3000, atk: 200, atkSpeed: 1.0, range: 135, speed: 105,
    charmRadius: 135,
    charmDuration: 5,
    charmHpThreshold: 0.4
  },
  ninja: {
    hp: 1900, atk: 330, atkSpeed: 0.9, range: 90, speed: 150,
    isMelee: true,
    skipHpMult: true,
    cloneCooldown: 18,
    cloneAttack: 100,
    cloneDuration: 5,
    cloneHpFraction: 0.5
  },
  mini: {
    hp: 600, atk: 100, atkSpeed: 0.6, range: 72, speed: 130,
    isMelee: true,
    skipHpMult: true,
    small: true
  },
  metal: {
    hp: 35, atk: 500, atkSpeed: 3.5, range: 72, speed: 70,
    isMelee: true,
    skipHpMult: true
  },
  necro: {
    hp: 1800, atk: 270, atkSpeed: 1.5, range: 135, speed: 90,
    skipHpMult: true,
    summonCooldown: 10
  },
  summon: {
    hp: 700, atk: 250, atkSpeed: 0.9, range: 72, speed: 120,
    isMelee: true,
    skipHpMult: true
  },
  lasso: {
    hp: 2400, atk: 300, atkSpeed: 1.1, range: 540, speed: 95,
    skipHpMult: true
  },
  ball: {
    hp: 5000, atk: 500, atkSpeed: 0, range: 45, speed: 189,
    skipHpMult: true,
    isBall: true
  },
  mine: {
    hp: 1800, atk: 0, atkSpeed: 0, range: 450, speed: 45,
    skipHpMult: true,
    plantInterval: 5
  },
  dj: {
    hp: 3000, atk: 100, atkSpeed: 0.6, range: 360, speed: 0,
    skipHpMult: true,
    isDj: true
  },
  lightning: {
    hp: 1300, atk: 300, atkSpeed: 1.0, range: 180, speed: 135,
    skipHpMult: true,
    boltEveryHits: 5,
    boltDelay: 1,
    boltDamage: 1500,
    boltStun: 2,
    boltChainDelay: 0.5
  },
  slime: {
    hp: 2500, atk: 800, atkSpeed: 3, range: 45, speed: 67.5,
    skipHpMult: true,
    isMelee: true
  },
  god: {
    hp: 3000, atk: 300, atkSpeed: 1.2, range: 270, speed: 90,
    skipHpMult: true,
    piercing: true,
    pierceHalfWidth: 26,
    immediateFirstAttack: true
  },
  instinct: {
    hp: 2000, atk: 300, atkSpeed: 1, range: 180, speed: 110,
    skipHpMult: true,
    evadeChance: 0.20,
    evadeRadius: 90,
    evadeDamage: 300
  },
  arcane: {
    hp: 1900, atk: 400, atkSpeed: 1, range: 45, speed: 130,
    skipHpMult: true,
    isMelee: true
  },
  satellite: {
    hp: 3000, atk: 0, atkSpeed: 10, range: 180, speed: 90,
    skipHpMult: true,
    isShieldSupport: true,
    allyShield: 2000
  },
  portal: {
    hp: 1600, atk: 150, atkSpeed: 1, range: 135, speed: 105,
    skipHpMult: true,
    portalDelay: 3,
    portalRadiusPx: 180,
    protectionDuration: 4,
    protectionDamageMultiplier: 0.5
  },
  no_u: {
    hp: 5000, atk: 0, atkSpeed: 7, range: 0, speed: 70,
    skipHpMult: true,
    noAttack: true
  },
  tyrant: {
    hp: 6666, atk: 240, atkSpeed: 1, range: 45, speed: 85,
    skipHpMult: true,
    isMelee: true,
    tyrantRadius: 135
  },
  telescope: {
    hp: 2200, atk: 100, atkSpeed: 2, range: 180, speed: 90
  },
  hong: {
    hp: 1600, atk: 500, atkSpeed: 8, range: 225, speed: 100
  },
  levelup: {
    hp: 3400, atk: 450, atkSpeed: 1, range: 45, speed: 72,
    isMelee: true,
    formHealFraction: 0.35
  },
  reaper: {
    hp: 4444, atk: 1666, atkSpeed: 5, range: 90, speed: 76.5,
    isMelee: true, fanAngleDeg: 120, fanRadius: 90,
    windupDuration: 4, grudgeDuration: 15
  },
  smoke: {
    hp: 1200, atk: 200, atkSpeed: 1.3, range: 225, attackRange: 135, speed: 90,
    isMelee: true, fanAngleDeg: 100, fanRadius: 135,
    smokeChance: 0.10, smokeRadius: 135, smokeDuration: 2
  },
  battery: {
    hp: 1500, atk: 0, atkSpeed: 4, range: 90, speed: 90,
    isCooldownSupport: true, cooldownReduction: 0.20
  },
  impeachment: {
    hp: 4800, atk: 250, atkSpeed: 1.2, range: 135, speed: 90,
    attackRadius: 135, hitThreshold: 10, impeachmentDuration: 7, impeachmentShield: 4000
  },
  bomb: {
    hp: 1300, atk: 0, atkSpeed: 0, range: 135, speed: 162,
    noAttack: true, explosionRadius: 135, explosionDelay: 0.8, explosionDamage: 2000
  },
  dragon: {
    hp: 4800, atk: 400, atkSpeed: 0.8, range: 135, speed: 90,
    transformChance: 0.12, flightDistance: 450,
    flightDuration: 1.5, fireTrailDuration: 5, fireTrailInterval: 0.5, fireTrailDamage: 250,
    landingRadius: 90, landingDamage: 300,
    landingDr: 0.20, landingDrDuration: 5
  },
  meteor: {
    hp: 1800, atk: 800, atkSpeed: 5, range: 270, speed: 90,
    meteorDelay: 3, meteorRadiusMultiplier: 2, meteorBurnDuration: 5,
    meteorBurnDps: 100, meteorKnockback: 120
  },
  blizzard: {
    hp: 2200, atk: 270, atkSpeed: 1, range: 180, speed: 90,
    blizzardCooldown: 12, blizzardFreeze: 3.5, blizzardSlowDuration: 3,
    blizzardAtkPenalty: 0.25, blizzardSpeedPenalty: 0.50
  },
  beam: {
    hp: 1500, atk: 100, atkSpeed: 0.2, range: 382.5, speed: 90,
    beamWarmup: 2, beamInterval: 0.2, beamRampInterval: 1, beamRampDamage: 20
  },
};
