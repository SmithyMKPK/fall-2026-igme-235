// The different kind of moves
const MoveType = Object.freeze({
    BUFF: 1,
    DEBUFF: 2,
});

// The different targets a move can take
const TargetType = Object.freeze({
    SELF: 0,
    ENEMY: 1,
    ALL: 2,
});

// Dictates what a character is at the most basic level
class Character{
    constructor(name, healthPoints, mana, moves = []){
        this.name = name;
        this.healthPoints = healthPoints;
        this.mana = mana;
        this.moves = moves;
        this.attackBuff = 0;
        this.defenseBuff = 0;
    }

    // Removes a given amount of damage to
    takeDamage(howMuch){
        this.healthPoints -= howMuch;
    }

    // Removes a given amount of mana 
    takeMana(howMuch){
        this.mana -= howMuch
    }
}

// Something that a character can do while it's their turn
class Move{
    constructor(name, target, turnCooldown, manaCost){
        this.name = name;
        this.target = target;
        this.turnCooldown = turnCooldown;
        this.manaCost = manaCost;
    }
}

// An move that intends to harm another character
class Attack extends Move{
    constructor(name, target, turnCooldown, manaCost, damage, isPercentage = false){
        super(name, target, turnCooldown, manaCost);
        this.damage = damage;
        this.isPercentage = isPercentage;
    }
}

// A move that intends to 
class BuffDebuff extends Move{
    constructor(){

    }
}