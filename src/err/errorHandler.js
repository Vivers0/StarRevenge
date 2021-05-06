
const errorSend = async (error, message) => {
    message.client.users.fetch(process.env.OWNER).send('')
    return message.reply("Возникла ошибка")
}