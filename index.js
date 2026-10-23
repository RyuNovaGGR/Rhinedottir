const {
    ActionRowBuilder,
    ActivityType,
    Client,
    Events,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");

const client = new Client({ intents: 53608447 });

const commands = [
    new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Muestra el menú de opciones."),
    new SlashCommandBuilder()
        .setName("carreras")
        .setDescription("Muestra las carreras disponibles."),
    new SlashCommandBuilder()
        .setName("precios")
        .setDescription("Muestra los precios mensuales."),
    new SlashCommandBuilder()
        .setName("ubicacion")
        .setDescription("Muestra la ubicación del centro educativo."),
    new SlashCommandBuilder()
        .setName("sobre")
        .setDescription("Muestra la información del bot."),
    new SlashCommandBuilder()
        .setName("ayuda")
        .setDescription("Muestra la ayuda del bot."),
].map((command) => command.toJSON());

const responses = {
    carreras: [
        "Carreras disponibles:",
        "7mo Grado",
        "8vo Grado",
        "9no Grado",
        "10mo Grado",
        "11vo Bachillerato Tecnico Profesional en Informatica",
        "11vo Bachillerato Tecnico Profesional en Contaduria y Finanzas",
        "11vo Bachillerato en Ciencias y Humanidades",
        "12vo Bachillerato Tecnico Profesional en Informatica",
        "12vo Bachillerato Tecnico Profesional en Contaduria y Finanzas",
    ].join("\n"),
    precios: [
        "8vo Grado 4500Lps mensual",
        "9no Grado 4000Lps mensual",
        "10mo Grado 5000Lps mensual",
        "11vo Bachillerato Tecnico Profesional en Informatica 5400Lps mensual",
        "11vo Bachillerato Tecnico Profesional en Contaduria y Finanzas 5200Lps mensual",
        "11vo Bachillerato en Ciencias y Humanidades 5000Lps mensual",
        "12vo Bachillerato Tecnico Profesional en Informatica 6.000Lps mensual",
        "12vo Bachillerato Tecnico Profesional en Contaduria y Finanzas 6.000Lps mensual",
    ].join("\n"),
    ubicacion: [
        "Centro Educativo Bilingue Metodista, Barrio Willie Warren, Roatan, Honduras.",
    ].join("\n"),
    sobre: [
        "Este bot fue creado por: II de Bachillerato Tecnico Profesional en Informatica, Centro Educativo Bilingue Metodista, Roatan, Honduras.",
        "Con el fin de ayudar a los estudiantes y padres de familia a obtener información sobre las carreras, precios y ubicación del centro educativo.",
    ].join("\n"),
    ayuda: [
        "Comandos disponibles:",
        "/menu - Muestra el menú de opciones.",
        "/Carreras - Muestra las carreras disponibles.",
        "/Precios - Muestra los precios mensuales.",
        "/Ubicacion - Muestra la ubicación del centro educativo.",
        "/Sobre - Muestra la información del bot.",
        "/Ayuda - Muestra la ayuda del bot.",
    ].join("\n"),
};

// Menu principal
function crearMenu() {
    const menu = new StringSelectMenuBuilder()
        .setCustomId("menu_principal")
        .setPlaceholder("Elige una opción")
        .addOptions(
            {
                label: "Carreras",
                description: "Muestra las carreras disponibles.",
                value: "carreras",
            },
            {
                label: "Precios",
                description: "Muestra los precios mensuales.",
                value: "precios",
            },
            {
                label: "Ubicación",
                description: "Muestra la ubicación del centro educativo.",
                value: "ubicacion",
            },
            {
                label: "Sobre",
                description: "Muestra la información del bot.",
                value: "sobre",
            },
            {
                label: "Ayuda",
                description: "Muestra la ayuda del bot.",
                value: "ayuda",
            },
        );

    return new ActionRowBuilder().addComponents(menu);
}

client.once(Events.ClientReady, async () => {
    console.log(`Version 2, Online: ${client.user.tag}`);
    client.user.setActivity("CEBM Bot", {
        type: ActivityType.Playing,
    });

    try {
        await client.application.commands.set(commands);
        console.log("Slash commands registered.");
    } catch (error) {
        console.error("Failed to register slash commands:", error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
   
    if (
        interaction.isStringSelectMenu() &&
        interaction.customId === "menu_principal"
    ) {
        const selected = responses[interaction.values[0]];
        if (selected) {
            await interaction.update({
                content: selected,
                components: [crearMenu()],
            });
        }
        return;
    }

    if (!interaction.isChatInputCommand()) {
        return;
    }

    // Comando /menu
    if (interaction.commandName === "menu") {
        await interaction.reply({
            content: "¿Qué quieres consultar?",
            components: [crearMenu()],
        });
        return;
    }

    const response = responses[interaction.commandName];
    if (response) {
        await interaction.reply(response);
    }
});

if (!process.env.DISCORD_TOKEN) {
    throw new Error("The DISCORD_TOKEN environment variable is required.");
}

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error("Failed to log in to Discord:", error);
    process.exitCode = 1;
});
