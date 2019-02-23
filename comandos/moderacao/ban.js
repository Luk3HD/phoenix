const Discord = require('discord.js');
const util = require('../../utilitarios/util.js')
exports.run = async function(client, message, args) {
    const membro = message.mentions.members.first() || message.guild.members.get(args[0])
    let motivo = args.slice(1).join(" ");
    if(!membro)return client.emit('ajudaComando', message, this.ajuda, this.configuracao);
    if(membro == message.member) return client.emit("embedDescricao",message,"Você não pode usar esse comando em sí mesmo.",true)
    if(!motivo) motivo = 'Motivo não expecificado.'

await message.channel.send(`Você deseja mesmo banir <@${membro.id}>? Caso sim, clique no <:correto:538036543080890368>, caso não, clique no <:incorreto:538036569060278273>!`)
.then(async m =>{
    await m.react('538036543080890368')
    await m.react('538036569060278273')
    
    let reacao = ['538036543080890368','538036569060278273']
    const filter = (reaction, user) => reacao.includes(reaction.emoji.id) && user.id === message.author.id
    const collector = m.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', async r => {
        if(r.emoji.id == '538036569060278273') {
            m.delete().catch()
            return client.emit("embedDescricao",message,"Operação cancelada!",true)
        }
        else if(r.emoji.id == '538036543080890368'){
        util.punir(message.guild.id, membro.id, motivo, message.author.id, 0, 'false', client)
        
        m.delete().catch()
            membro.ban(motivo);
            const embed = new Discord.RichEmbed()
            .setTitle('Banimento')   
            .setColor('#ffffff')
            .setDescription('<:martelodoban:531220056554733578> | O usuário ' + membro + ' foi **banido**.\n\n**Motivo:** \`' + motivo + '.\`')
            .setFooter(`${message.author.tag}`, ` ${message.author.avatarURL}`)
            .setTimestamp()
            message.channel.send(embed)
            //try{client.channels.get(client.servidores[message.guild.id].logs).send(embed)}catch{}
        }
        })
    })
}
exports.configuracao = {
    apenasCriador: false,
    modulo: 'moderacao',
    aliases: ['banir'],
    permissoesNecessarias: ['BAN_MEMBERS'],
    permissoesBot: ['BAN_MEMBERS']
};

exports.ajuda = {
    nome: 'ban',
    descricao: 'Bane o usuário do servidor.',
    usar: 'ban <usuário> [motivo]',
    exemplos: ['Mee6 ser um bot','Tatsu porque sim']
};