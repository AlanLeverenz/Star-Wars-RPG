// execute code when DOM is ready

$(document).ready(function() {
    var characters = {
        "Poe Dameron": {
            name: "Poe Dameron",
            health: 100,
            attack: 12,
            imageUrl: "assets/images/peo-dameron.jpg",
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
    console.log(characters);

    // function renders a character card to the page.
    // character rendered and the area they are rendered to.
    var renderOne = function(character, renderArea) {
        var charDiv = $("div class='character' data-name='" + character.name + "'>");
        var charName = $("div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
    }

    // handles character rendering
    var renderCharacters = function(charObj, areaRender) {
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            for (var key in charObj) {
                if(charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender);
                }
            }
        }
    }

    // Render all characters to the page when game starts
    renderCharacters(characters, "#characters-section");
}); // end document.ready