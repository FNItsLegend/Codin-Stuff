import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  ButtonBuilder,
  TextInputBuilder,
  Client,
  TextInputStyle,
  Interaction,
  InteractionType,
  ButtonInteraction,
} from 'discord.js';
import { Config } from '../handlers/ConfigHandler.js';
import { ErrorHandler } from '../handlers/ErrorHandler.js';
import { Client2 } from '../main';

/*
Event Name: "interactionCreate"
Event Triggers: When a user interacts with the bot vis /commands, buttons, menus, etc.
Once: No
Event Arguments:
- Interaction: Information about the interaction that initiated this event.
- Client: The bot's client instance.
*/
export const name = 'interactionCreate';
export async function execute(interaction: Interaction, client: Client2) {
  try {
    if (interaction.type === InteractionType.ApplicationCommand) {
      // Handle Slash Commands Here
      const command = client.commands.get(interaction.commandName);
      if (!command || !interaction.isChatInputCommand()) return; //Not used at the moment.
      await command.execute(interaction);
    } else if (interaction.type === InteractionType.ModalSubmit) {
      // Handle Modal Interactions Here
      if (interaction.customId === 'personal_settings') {
      }
    } else if (interaction.isButton()) {
      // Handle Button Interactions Here
      if (interaction.customId === 'settings_exit') {
        interaction.update({
          content: `Settings View Ended.`,
          components: [],
        });
      }
    } else if (interaction.type === InteractionType.MessageComponent) {
      // Handle Select Menu Interactions Here
      if (interaction.customId === 'settings_type') {
        // First Stage Settings
        const interactionValue = interaction.values[0];
        // console.log(interactionValue);
        if (interactionValue === 'personal') {
          const config = new Config(interaction.user);
          const modal = new ModalBuilder()
            .setTitle('Personal Settings')
            .setCustomId('personal_category')
            .addComponents();
          await interaction.showModal(modal);
        } else if (interactionValue === 'guild') {
          if (interaction.memberPermissions.has('ManageGuild')) {
            const SettingSelectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('guild_category')
                .setPlaceholder('Select the setting you want to view.')
                .addOptions([
                  {
                    label: "Logger's Channel ID",
                    value: 'logChannelID',
                    description: "The ID of the channel for the bot's logger to send messages to.",
                  },
                ]),
            );
            await interaction.update({
              content: `Here are the Server's settings.\nSelect which one you want to view.`,
              components: [SettingSelectMenu],
            });
          } else {
            await interaction.update({
              content: `You do not have enough permissions to view the server's settings.`,
            });
          }
        }
      }
    }
  } catch (err) {
    const errObject = new ErrorHandler(err, 'interaction');
    if (errObject.code !== 'Unhandled') {
      console.log(
        `End of code catch triggered:\nMessage: ${errObject.message}\nCode: ${errObject.code}`,
      );
    } else {
      console.log(err);
      console.log(
        `Unhandled end of code catch triggered with action ${errObject.action}:\n${errObject.message}`,
      );
    }
  }
}
