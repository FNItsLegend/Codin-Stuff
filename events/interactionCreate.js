/*
Event Name: "interactionCreate"
Event Triggers: When a user interacts with the bot vis /commands, buttons, menus, etc.
Once: No
Event Arguments:
- Interaction: Information about the interaction that initiated this event.
- Client: The bot's client instance.
*/
module.exports = {
    name: "interactionCreate",
    async execute (interaction, client) {
        if (!interaction.isCommand()) {return}
        
        const command = client.commands.get(interaction.commandName)
        if (!command) return; //not really used

        if (command.perms && !interaction.member.permissions.has(command.perms)){ // Rarely Used since Discord blocks /commands for users who don't have the required permissions.
            return interaction.reply({
                content: `You do not have the required permission! (Missing Permission: ${command.perms})`,
                ephemeral: true,
            })
        } else if (command.perms && !interaction.appPermissions.has(command.perms)) {
            return interaction.reply({
                content: `I do not have the required permission to perform this! \`(Missing Permission: ${command.perms})\``,
                ephemeral: true,
            })
        }
        try {
            await command.execute(interaction, client)
        } catch(err) {
            if (err) {
                console.error(err)

                await interaction.reply({
                    content: "An error occurred while executing that command.",
                    ephemeral: true
                })
            }
        }
    }
}