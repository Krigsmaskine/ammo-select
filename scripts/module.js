import { registerSettings } from './settings.js';
import { ammoSelect } from './functions.js';

Hooks.once('init', async function () {
  registerSettings();
});

Hooks.once('ready', async function () {
  ui.notifications.info("Test loaded. REMOVE ME BEFORE RELEASE.")
  Hooks.on("dnd5e.preUseItem", ammoSelect);
});

Hooks.on("renderItemSheet5e", async (sheet, html, item) => {
  const automatic = game.settings.get("ammo-select", "automatic");
  if (automatic) return;

  // Adding ammunition use dropdown on weapons for manual setup.
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

  // Adding ammunition type on ammunition items for manual setup.
  if (sheet.object.system?.consumableType == "ammo") {
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
