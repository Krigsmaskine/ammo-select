const moduleName = 'ammo-select';
export function registerSettings() {
    game.settings.register(moduleName, 'autoPrompt', {
        'name': 'Auto Prompt',
        'hint': `Choose whether to have Ammo Select automatically prompt for ammo selection when rolling the item. Options: on for all player characters, select player characters with checkbox toggled in the special traits of the actors' sheet or disabled entirely.`,
        'scope': 'world',
        'config': true,
        'type': String,
        'requiresReload': true,
        'default': "disabled",
        'choices': {
            "disabled": "Disable auto prompt",
            "all": "All player characters.",
            "selective": "Only toggled player characters.",
        },
        'onChange': async value => {
            console.log(value);
        }
    });

    game.settings.register(moduleName, 'ammoTypes', {
        'name': 'Ammunition Types',
        'hint': `A comma-separated list of ammunition types available in this world to pair with weapons that use ammunition.`,
        'scope': 'world',
        'config': true,
        'type': String,
        'requiresReload': true,
        'default': "Arrow,Bolt,Bullet,Pellet",
        'onChange': async value => {
            console.log(value);
        }

    });
};