const readline = require('readline-sync');
import { MyPlayer, Enemies, Boss } from '../group-1017109/json';
import { bosses, enemies, players } from '../group-1017109/interface';

const rarityWeights = [0.5, 0.3, 0.15, 0.04, 0.01];
let playerCoins = 12;

function getRandomElement(rarityWeights, characters) {
  const randomValue = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < characters.length; i++) {
    cumulativeWeight += rarityWeights[characters[i].rarity - 1];
    if (randomValue <= cumulativeWeight) {
      return characters[i];
    }
  }
}
const myPlayer: players = getRandomElement(rarityWeights, MyPlayer());
let enemy: enemies = getRandomElement(rarityWeights, Enemies());
const Bossenemy: bosses = getRandomElement(rarityWeights, Boss());

function displayHPBar(entity) {
  const barLength = 20;
  const ratio = entity.hp / entity.max_hp;
  const bar = '='.repeat(Math.ceil(barLength * ratio)) + ' '.repeat(Math.floor(barLength * (1 - ratio)));
  return `[${bar}] ${entity.hp}/${entity.max_hp}`;
}

function Attack(attacker: players, target: enemies) {
  const damage = attacker.str;
  target.hp -= damage;
  console.log(`${attacker.name} attaque ${target.name} pour ${damage} de dégâts !`);
}

export function Heal(hp, hpmax) {
  hp += hpmax / 2;
  if (hp >= hpmax) {
    hp = hpmax;
    console.log(`${myPlayer.name} se soigne de ${hp} PV.`);
  }
  return hp;
}

function greenText(text) {
  return `\x1b[32m${text}\x1b[0m`;
}

function redText(text) {
  return `\x1b[31m${text}\x1b[0m`;
}

function blueText(text) {
  return `\x1b[34m${text}\x1b[0m`;
}

function displayNumberOfCombatsSelectionScreen() {
  console.log('');
  console.log('Combien de combats souhaitez-vous jouer ?');
  console.log('');

  const options = [10, 20, 50, 100];
  const numberOfCombats = options[readline.keyInSelect(options, 'Choisissez un nombre de combats :')];

  return numberOfCombats;
}

function game(selectedDifficulty, numberOfCombats) {
  console.log('Bienvenue, Joueur');
  let floor = 1;
  let coinsGained = 1;

  for (let combat = 1; combat <= numberOfCombats; combat++) {
    if (selectedDifficulty === 'Difficile') {
      enemy.hp *= 1.5;
      enemy.max_hp *= 1.5;
      enemy.str *= 1.5;
    } else if (selectedDifficulty === 'Insensée') {
      enemy.hp *= 2;
      enemy.max_hp *= 2;
      enemy.str *= 2;
    }

    while (enemy.hp > 0 && myPlayer.hp > 0) {
      console.log(blueText(`======== Étage ${floor} ========`));

      console.log(`${myPlayer.name}: PV ${myPlayer.hp}/${myPlayer.max_hp} | FOR ${myPlayer.str}`);
      console.log(displayHPBar(myPlayer));
      console.log(`${enemy.name}: PV ${enemy.hp}/${enemy.max_hp} | FOR ${enemy.str}`);
      console.log(displayHPBar(enemy));
      const action = readline.question("Choisissez votre action (1-Attaquer/2-Soigner): ").toLowerCase();

      if (action === "1" || action === "attaque") {
        Attack(myPlayer, enemy);
        if (enemy.hp <= 0) {
          playerCoins += coinsGained;
          console.log(greenText(`${enemy.name} est vaincu ! 🎉 Vous gagnez ${coinsGained} pièce(s). Total de pièces : ${playerCoins}`));
        } else {
          Attack(enemy, myPlayer);
        }
      } else if (action === '2' || action === 'soigner') {
        if (myPlayer.hp === myPlayer.max_hp) {
          console.log('Votre personnage a tous ses points de vie');
        } else if (myPlayer.hp < 60) {
          myPlayer.hp = Heal(myPlayer.hp, myPlayer.max_hp);
          Attack(enemy, myPlayer);
        }
      }

      if (myPlayer.hp <= 0) {
        console.log(redText('Game Over. Vous avez été vaincu.'));
        return;
      }

      if (enemy.hp <= 0 && floor !== 10) {
        console.log("");
        console.log('Passage à l\'étage suivant...');
        floor++;
        enemy = getRandomElement(rarityWeights, Enemies());
      }

      if (floor === 10 && enemy.hp > 0) {
        console.log(redText('Cest le dernier étage. Le Boss vous attend ! 🔥🔥'));
        enemy = Bossenemy;
      }

      if (floor === 10 && enemy.hp <= 0) {
        console.log(greenText('🎉 Félicitations ! Vous avez vaincu le Boss et remporté la partie ! 🎉'));
        return;
      }
    }
  }
}
const asciiArt = ` 






░▀█▀░█░█░█▀▀░░░█░█░█░█░█▀▄░█░█░█░░░█▀▀░░░█▀▀░█▀█░█▀▀░▀█▀░█░░░█▀▀░░
░░█░░█▀█░█▀▀░░░█▀█░░█░░█▀▄░█░█░█░░░█▀▀░░░█░░░█▀█░▀▀█░░█░░█░░░█▀▀░░
░░▀░░▀░▀░▀▀▀░░░▀░▀░░▀░░▀░▀░▀▀▀░▀▀▀░▀▀▀░░░▀▀▀░▀░▀░▀▀▀░░▀░░▀▀▀░▀▀▀░░                            
                                                                                                                                                                                     
                                                                                                                                                                                     
`;

console.log(redText(asciiArt));
let titleOptions = ['Nouvelle Partie'];
let titleChoice = readline.keyInSelect(titleOptions, 'Bonjour, faites votre choix:');

if (titleChoice === 0) {
  let modes = ['Normale', 'Difficile', 'Insensée'];
  let difficultyChoice = readline.keyInSelect(modes, 'Sélectionnez la difficulté de la partie:');
  const numberOfCombats = displayNumberOfCombatsSelectionScreen();

  if (difficultyChoice === -1) {
    console.log('Au revoir');
  } else {
    const selectedDifficulty = modes[difficultyChoice];
    game(selectedDifficulty, numberOfCombats);
  }
}
