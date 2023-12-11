const readline = require('readline-sync'); //importation du modul qui permet de lire les fichiers .json
import { MyPlayer, Enemies, Boss } from '../group-1017109/json'; //importation des fonctions depuis le fichier .json
import { bosses, enemies, players } from '../group-1017109/interface'

const rarity = [0.5, 0.3, 0.15, 0.04, 0.01];

function getRandomElement(rarity, characters) {
  const randomValue = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < characters.length; i++) {
    cumulativeWeight += rarity[characters[i].rarity - 1];
    if (randomValue <= cumulativeWeight) {
      return characters[i];
    }
  }
}
const myPlayer : players = getRandomElement(rarity , MyPlayer());
let enemy : enemies= getRandomElement(rarity, Enemies());
const Bossenemy : bosses = getRandomElement(rarity , Boss());

function displayHPBar(entity) { 
  const barLength = 20; // Longueur de la barre
  const ratio = entity.hp / entity.max_hp; 
  const bar = '='.repeat(Math.ceil(barLength * ratio)) + ' '.repeat(Math.floor(barLength * (1 - ratio)));
  return `[${bar}] ${entity.hp}/${entity.max_hp}`;
}

function Attack(attacker, cible) {
  const damage = attacker.str;   // Calcul des degats
  cible.hp -= damage;// Soustraire les degats aux HP
  console.log(`${attacker.name} attacks ${cible.name} for ${damage} damage!`);
}

const hpmax = myPlayer.hp
export function Heal(hp: number) {
    hp += (hpmax / 2);
    if (hp >= hpmax) {
      hp = hpmax; //*
      console.log(`${myPlayer.name} heals for ${hp} HP.`);
    }
    return hp 
  };
  

function greenText(text) {
  return `\x1b[32m${text}\x1b[0m`;
}

function redText(text) {
  return `\x1b[31m${text}\x1b[0m`;
}

function blueText(text) {
  return `\x1b[34m${text}\x1b[0m`;
}

let floor = 1; 

function game() {
  console.log('Welcome Player');

  while (floor <= 10) // boucle principale 
  {// afficher le floor actuel
    while (enemy.hp > 0 && myPlayer.hp > 0) {
        console.log(blueText(`======== Floor ${floor} ========`));
        console.log(displayHPBar(myPlayer));
        console.log(displayHPBar(enemy));
        console.log(`${myPlayer.name}: HP ${myPlayer.hp}/${hpmax} | STR ${myPlayer.str}`);
        console.log(`${enemy.name}: HP ${enemy.hp}/${enemy.max_hp} | STR ${enemy.str}`);
      const action = readline.question("Choose your action (1-Attack/2-Heal): ").toLowerCase(); // inviter l'utilisateur a  entrer une reponse.

      if (action === "1" || action === "attack") {
        Attack(myPlayer, enemy);// le player attaque l'ennemi'
        if (enemy.hp <= 0) {
          console.log(greenText(`${enemy.name} is defeated! 🎉`)); 
        } else {
          Attack(enemy, myPlayer); // l'ennemi attaque le player
        }
      } else if (action === '2') {
        if (myPlayer.hp === hpmax) {
          console.log('Your character has all their health points');
        } else if (myPlayer.hp < 60) {
          myPlayer.hp = Heal(myPlayer.hp);
          Attack(enemy, myPlayer)
        }
    }

    if (myPlayer.hp <= 0) {
      console.log(redText('Game Over. You have been defeated.')); // afficher le message de defaite
      return;
    }

    if (enemy.hp <= 0 && floor !== 10) {
      console.log("");
      console.log('Proceeding to the next floor...');
      floor++; // incrementation pour passer a l'etage suivant
      enemy = getRandomElement(rarity, Enemies());; // generer un autre ennemi aleatoirememnt
    }
    if (floor === 10 && enemy.hp > 0) {
      console.log(redText('This is the final floor. The Boss awaits!🔥🔥'));
      enemy = Bossenemy; // Assigner le Bossenemy a la variable enemy
    }
    if (floor === 10 && enemy.hp <= 0) {// afficher le message de victoire en battant le boss
      console.log(greenText('🎉 Congratulations! You have defeated The Boss and won the game! 🎉'));
      return;
    }
  }
}}

const asciiArt = ` 






░▀█▀░█░█░█▀▀░░░█░█░█░█░█▀▄░█░█░█░░░█▀▀░░░█▀▀░█▀█░█▀▀░▀█▀░█░░░█▀▀░░
░░█░░█▀█░█▀▀░░░█▀█░░█░░█▀▄░█░█░█░░░█▀▀░░░█░░░█▀█░▀▀█░░█░░█░░░█▀▀░░
░░▀░░▀░▀░▀▀▀░░░▀░▀░░▀░░▀░▀░▀▀▀░▀▀▀░▀▀▀░░░▀▀▀░▀░▀░▀▀▀░░▀░░▀▀▀░▀▀▀░░                            
                                                                                                                                                                                     
                                                                                                                                                                                     
`;
console.log(asciiArt);
let option = ['Start Game'];
let choice = readline.keyInSelect(option, 'Bonjour, Faites votre choix:'); // creer un menu interactif

if (choice === 0) {
      game();
    }
   else {
    console.log('Au revoir');
  }
