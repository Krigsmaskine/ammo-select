import { registerSettings } from './settings.js';

Hooks.once('init', async function () {
  registerSettings();
});

Hooks.once('ready', async function () {
  ui.notifications.info("Test loaded.")
});

Hooks.on("dnd5e.preUseItem", async (item, config, options) => {
    if (item.system.properties?.amm === true && item.type == "weapon") {
      let id = 'ammo-select';
      let options = item.actor.items.filter(i => i.type === "consumable" && i.system.consumableType === "ammo" && i.flags?.["ammo-select"]?.ammoType === item.flags?.["ammo-select"]?.ammoType && i.flags?.["ammo-select"]?.ammoType).sort((a, b) => a.name.localeCompare(b.name)).map((item) => {
        let isDisabled = item.system.quantity === 0;
        return {
          name: item.name,
          label: `
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div style="display: flex; align-items: center;">
                  <img src="${item.img}" width="36" height="36" style="margin-right: 15px;">
                  <span>${item.name}</span>
                </div>
                <span>(${item.system.quantity})</span>
              </div>`,
          callback: isDisabled ? null : async () => {
            return await item.update({ "system.consume.target": item.id });
          },
          disabled: isDisabled
        }
      });
      if (!options.length) return true;
      let buttons = {};
      for (let o of options) buttons[o.name.slugify()] = o;
      await Dialog.wait({
        title: `Select ammunition for ${item.name}`,
        buttons,
        content: `<style>
                      #${id} {
                        height: max-content !important;
                        width: auto !important;
                      }
                      #${id} .dialog-buttons {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                      }
                      #${id} .dialog-button {
                        display: block;
                        padding: 3px 15px 3px 3px;
                        margin-bottom: 4px;
                      }
                      #${id} .window-title {
                        padding-right: 15px;
                      }
                      #${id} .dialog-button[disabled] {
                        opacity: 0.3;
                        pointer-events: none;
                      }
                    </style>`
      }, { id });
    };
    return true
  }
);

Hooks.on("renderItemSheet5e", async (sheet, html, item) => {
  // Adding ammunition use dropdown on weapons.
  if (sheet.object.type == "weapon") {
    const target = html.find(".uses-per")[0];
    const selectedType = item.item.getFlag('ammo-select', 'ammoType');
    let options = game.settings.get("ammo-select", "ammoTypes").split(",").reduce((acc, e) => e.toLowerCase() == selectedType ? acc += `<option value="${e.toLowerCase()}" selected>${e}</option>` : acc += `<option value="${e.toLowerCase()}">${e}</option>`, ``);
    // Adding a blank value. EventListeners don't fire when selecting the same value.
    options = `<option value="none"></option>` + options;


    const content = `<div class="form-group" title="Module: Ammo Selection">
    <label>Uses Ammunition Type <i class="fas fa-info-circle"></i></label>
      <div class="form-fields ammo-select">
        <select name="">
            ${options}
        </select>
      </div>
    </div>`;
    let div = document.createElement("DIV");
    div.innerHTML = content;
    target.after(...div.children);

    html[0].addEventListener("change", async (event) => {
      event.stopPropagation();
      if (event.target.parentElement.className == "form-fields ammo-select") {
        await item.item.setFlag('ammo-select', 'ammoType', event.target.value);
      }
    });
  };

  if (sheet.object.system?.consumableType == "ammo") {
    // Adding ammunition type on ammunition items.
    const target = html[0].querySelector(`select[name="system.consumableType"]`).parentElement;
    const selectedType = item.item.getFlag('ammo-select', 'ammoType');

    // Setting is a comma separated string that we split into array.
    let options = game.settings.get("ammo-select", "ammoTypes").split(",").reduce((acc, e) => e.toLowerCase() == selectedType ? acc += `<option value="${e.toLowerCase()}" selected>${e}</option>` : acc += `<option value="${e.toLowerCase()}">${e}</option>`, ``);

    // Adding a blank value. EventListener fires on change, so we need a blank for default.
    options = `<option value="none"></option>` + options;
    const content = `<div class="form-group ammo-type" title="Module: Ammo Selection">
    <label>Ammunition Type <i class="fas fa-info-circle"></i></label></label>
    <select name="">
        ${options}
    </select>
    </div>`;
    let div = document.createElement("DIV");
    div.innerHTML = content;
    target.after(...div.children);

    html[0].addEventListener("change", async (event) => {
      event.stopPropagation();
      if (event.target.parentElement.className == "form-group ammo-type") {
        await item.item.setFlag('ammo-select', 'ammoType', event.target.value);
      }
    });
  }
});
