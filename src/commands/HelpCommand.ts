import { BaseCommand } from "../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["h", "command", "commands", "cmd", "cmds"],
    name: "help",
    description: "Show the command list",
    usage: "{prefix}help [command]"
})
export class HelpCommand extends BaseCommand {
    public execute(message: IMessage, args: string[]): void {
        const command = message.client.commands.get(args[0]) ??
            message.client.commands.get(message.client.commands.aliases.get(args[0])!);
        if (command && !command.meta.disable) {
            message.channel.send(
                new MessageEmbed()
                    .setColor(this.client.config.embedColor)
                    .setAuthor(`Information for the ${command.meta.name} command`, "")
                    .addFields({ name: "**Name**", value: command.meta.name, inline: true },
                        { name: "**Description**", value: command.meta.description, inline: true },
                        { name: "**Aliases**", value: `${Number(command.meta.aliases?.length) > 0 ? command.meta.aliases?.map(c => `${c}`).join(", ") as string : "None"}`, inline: true },
                        { name: "**Usage**", value: `**\`${command.meta.usage?.replace(/{prefix}/g, message.client.config.prefix) as string}\`**`, inline: true })
            ).catch(e => this.client.logger.error("HELP_CMD_ERR:", e));
        } else {
            message.channel.send(
                createEmbed("info", message.client.commands.filter(cmd => !cmd.meta.disable && cmd.meta.name !== "eval").map(c => `\`${c.meta.name}\``).join(" "))
                    .setAuthor("Command List")
                    .setThumbnail(message.client.user?.displayAvatarURL() as string)
                    .setFooter(`Use ${message.client.config.prefix}help <command> to get more information on a specific command!`, "")
            ).catch(e => this.client.logger.error("HELP_CMD_ERR:", e));
        }
    }
}
