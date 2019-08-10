// execute code when DOM is ready

$(document).ready(function() {
    var characters = {
        "Poe Dameron": {
            name: "Poe Dameron",
            health: 100,
            attack: 12,
            imageUrl: "assets/images/poe-dameron.jpg",
            enemyAttackBack: 15
        },
        "Rey": {
            name: "Rey",
            health: 120,
            attack: 16,
            imageUrl: "assets/images/rey.jpg",
            enemyAttackBack: 5
        },
        "Tusken Raider": {
            name: "Tusken Raider",
            health: 150,
            attack: 8,
            imageUrl: "assets/images/tusken-raider.jpg",
            enemyAttackBack: 10
        },
        "Kylo-Ren": {
            name: "Kylo-Ren",
            health: 180,
            attack: 7,
            imageUrl: "assets/images/kylo-ren.jpg",
            enemyAttackBack: 20
        }
    }; // end var characters
    
    // will be populated when the player selectes the character.
    var currSelectedCharacter;
    // populated with all the characters the player didn't select.
    var combatants = [];
    // will be populated when the player chooses an opponent.
    var currDefender;
    // will keep track of turns during combat. used for calculating player...
    var turnCounter = 1;
    //tracks number of defeated opponents.
    var killCount = 0;


// FUNCTIONS
// =====================================================================================

    // function renders a character card to the page.
    // character rendered and the area they are rendered to.
    var renderOne = function(character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        // if the character is an enemy of defender (active opponent), add it to the char div
        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
        else if (charStatus === "defender") {
            // populate currDefender with the selected opponent's information
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    };

    // function to handle rendering game messages.
    var renderMessage = function(message) {
        
        // builds the message and appends it to the page.
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        // if we get this specific message passed in, clear the message...
        if (message === "clearMessage") {
            gameMessageSet.text("");
        }

    }
 
    // handles character rendering of characters based on which ...
    var renderCharacters = function(charObj, areaRender) {

        // "characters-section" is the div where all our characters are displayed
        // "if true, render all characters to the starting area."
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            // loop through the characters object and call the renderOne
            for (var key in charObj) {
                if(charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender);
                }
            }
        }

        // "selected-character" is the div where our selected character appears.
        // if true, render the selected player character to this area.
        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender);
        }

        // "available-to-attack" is the div where our "inactive" opponents are displayed
        // if true, render the selected character to this area.
        if (areaRender === "#available-to-attack-section") {

            // loop through the combatants array and call the renderOne function
            for(var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }

            // creates an onclick event for each enemy.
            $(document).on("click", ".enemy", function() {
                var name = ($(this).attr("data-name"));

                // if there is no defender, the clicked enemy will become the next defender
                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }

        // "defender" is the div where the active opponent appears.
        // if true, render the selected enemy in this location.
        if (areaRender = "#defender") {
            $(areaRender).empty();
            for (var i = 0;  i < combatants.length; i++) {
                if(combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }

        // re-render defender when attacked.
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }

        // re-render player character when attacked.
        if (areaRender === "enemyDamage") {
            $("#selected-character").empty();
            renderOne(charObj, "#selected-character", "");
        }

        // remove defeated enemy.
        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
            renderMessage(gameStateMessage);
        }
    }; // end of var renderCharacters function

        // function which handles restarting the game after victory or defeat.
        var restartGame = function(inputEndGame) {

            // when the 'Restart' button is clicked, reload the page.
            var restart = $("<button>Restart</button>").click(function() {
                location.reload();
            });

            // build div that will display the vicotry/defeat message.
            var gameState = $("<div>").text(inputEndGame);

            // render the restart button and victory/defeat message to the page.
            $("body").append(gameState);
            $("body").append(restart);
        }; // end of restartGame var


    // ================================================================

    // Render all characters to the page when game starts
    renderCharacters(characters, "#characters-section");

    // on click event for selecting our character
    $(document).on("click", ".character", function () {
        // saving the clicked character's name
        var name = $(this).attr("data-name");
        console.log("name = " + name)

        // if a player characters has not yet been chosen...
        if (!currSelectedCharacter) {
            // we populate currSelectedCharacter with the selected character
            currSelectedCharacter = characters[name];
            console.log("currSelectedCharacter = " + currSelectedCharacter)
            // we then loop through the remaining characters
            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key]);
                }
            }

            console.log(combatants);
            // hide the character select div
            $("#characters-section").hide();

            // then render the selected and the combatants
            renderCharacters(currSelectedCharacter, "#selected-character");
            renderCharacters(combatants, "#available-to-attack-section");
        }
    });

    // when you click the attack button, run the following game logic...
    $("#attack-button").on("click", function() { 

        console.log ("CLICKED ATTACK BUTTON");

            if ($("#defender").children().length !== 0) {

                // creates messages for our attack and our opponents counter attack
                var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack + turnCounter) + " damage.";
                var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
                renderMessage("clearMessage");

                // reduce defender's Health Points
                currDefender.health -= (currSelectedCharacter.attack * turnCounter);

                // if the enemy still has health...
                if (currDefender.health > 0) {

                    // render the enemy's updated character card.
                    renderCharacters(currDefender, "playerDamage");

                    // render the combat messages.
                    renderMessage(attackMessage);
                    renderMessage(counterAttackMessage);

                    // reduce your health by the opponent's attack value.
                    currSelectedCharacter.health -= currDefender.enemyAttackBack;

                    // render the player's updated character card.
                    renderCharacters(currSelectedCharacter, "enemyDamage");

                    // if you have less than zero health the game ends.
                    // we call the restartGame function to allow the user to
                    if (currSelectedCharacter.health <= 0) {
                        renderMessage("clearMessage");
                        restartGame("You have been defeated... GAME OVER!!!");
                        $("#attack-button").unbind("click");
                    }
                }
                else {
                    //remove your opponent's character card.
                    renderCharacters(currDefender, "enemyDefeated");
                    // increment your kill count
                    killCount++;
                    // if you have killed all of your opponents you win.
                    // call the restartGame 
                    if (killCount >= 3) {
                        renderMessage("clearMessage");
                        restartGame("You Won!!! GAME OVER!!!");
                    }
                }
            }

            // if the enemy has less than zero health they are defeated.
            turnCounter++;
    });


}); // end document.ready