const moduleName = 'ammo-select';
export function registerSettings() {
    game.settings.register(moduleName, 'automatic', {
        'name': 'Toggle automatic setup',
        'hint': `Toggle to use our suggested weapon and ammo setup or disable to be able to set your own, using the settings labelled Manual below and on items.`,
        'config': true,
        'type': Boolean,
        'default': true,
        'requiresReload': true
    });

    game.settings.register(moduleName, 'autoPrompt', {
        'name': 'Auto Prompt',
        'hint': `Choose whether to have Ammo Select automatically prompt for ammo selection when rolling the item. On for all player characters, on for everyone or disabled entirely.`,
        'scope': 'world',
        'config': true,
        'type': String,
        'requiresReload': true,
        'default': "disabled",
        'choices': {
            "disabled": "Disable auto prompt",
            "allPC": "All player characters.",
            "all": "Only toggled player characters.",
        },
        'onChange': async value => {
            console.log(value);
        }
    });

    game.settings.register(moduleName, 'ammoTypes', {
        'name': 'Manual Setup: Ammunition Types',
        'hint': `A comma-separated list of ammunition types available in this world to pair with weapons that use ammunition. Requires automatic mode to be toggled off.`,
        'scope': 'world',
        'config': true,
        'type': String,
        'requiresReload': true,
        'default': "Arrow,Bolt,Bullet,Pellet",
        'onChange': async value => {
            console.log(value);
        }

    });

    game.settings.register(moduleName, 'darkMode', {
        'name': 'Dark Mode',
        'hint': `Enable dark mode for your ammo select prompts.`,
        'scope': 'world',
        'config': true,
        'type': Boolean,
        'requiresReload': 'true',
        'default': false
    })
};