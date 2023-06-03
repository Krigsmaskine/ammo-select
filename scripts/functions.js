export async function ammoSelect(item, config, options) {
    const automatic = game.settings.get("ammo-select", "automatic");

    // Map for automatic mode.
    // Base weapon types to ammunition keywords.
    const baseWeaponToAmmo = {
        'longbow': 'arrow',
        'shortbow': 'arrow',
        'lightcrossbow': 'bolt',
        'handcrossbow': 'bolt',
        'heavycrossbow': 'bolt',
        'sling': 'bullet',
        'musket': 'bullet',
        'pistol': 'bullet',
        'revolver': 'bullet',
        'blowgun': 'needle',
        'scattergun': 'shot'
    };

    if (item.system.properties?.amm === true && item.type == "weapon") {
        const id = 'ammo-select';
        const cssClass = game.settings.get("ammo-select", "darkMode") ? "ammo-select-dark" : "ammo-select-light";
        const weapon = item;
        const weaponType = item.system.baseItem;
        const ammoType = baseWeaponToAmmo[weaponType];

        
        let buttons = {};
        if (automatic) {
            const ammoOptions = item.actor.items.filter(i => i.type == "consumable" && i.system.consumableType == "ammo" && i.name.toLowerCase().includes(ammoType)).sort((a, b) => a.name.localeCompare(b.name)).map((option) => {
                let isDisabled = option.system.quantity === 0;
                return {
                    name: option.name,
                    label: `
                      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                        <div style="display: flex; align-items: center;">
                          <img src="${option.img}" width="36" height="36" style="margin-right: 15px;">
                          <span>${option.name}</span>
                        </div>
                        <span>(${option.system.quantity})</span>
                      </div>`,
                    callback: isDisabled ? null : async () => {
                        return await weapon.update({ "system.consume.target": option.id });
                    },
                    disabled: isDisabled
                }
            });
            if (!ammoOptions.length) return true;
            for (let o of ammoOptions) {
                buttons[o.name.slugify()] = o;
            }
        }
        else {
            const ammoOptions = item.actor.items.filter(i => i.type === "consumable" && i.system.consumableType === "ammo" && i.flags?.["ammo-select"]?.ammoType === weapon.flags?.["ammo-select"]?.ammoType && i.flags?.["ammo-select"]?.ammoType).sort((a, b) => a.name.localeCompare(b.name)).map((option) => {
                let isDisabled = option.system.quantity === 0;
                return {
                    name: option.name,
                    label: `
                      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                        <div style="display: flex; align-items: center;">
                          <img src="${option.img}" width="36" height="36" style="margin-right: 15px;">
                          <span>${option.name}</span>
                        </div>
                        <span>(${option.system.quantity})</span>
                      </div>`,
                    callback: isDisabled ? null : async () => {
                        return await weapon.update({ "system.consume.target": option.id });
                    },
                    disabled: isDisabled
                }
            });
            if (!ammoOptions.length) return true;
            for (let o of ammoOptions) {
                buttons[o.name.slugify()] = o;
            }
        }
        // TO DO
        // Make a promised dialog instead of using the Dialog#wait, as it specifically returns no arguments and we cannot use it for storing location.
        await Dialog.wait({
            title: `Select ammunition for ${item.name}`,
            buttons,
            content: ``,
            close: () => {
                console.log("Ammo Select prompt closed.")
            }
        }, { id, classes: [cssClass] });
        return true
    };

};