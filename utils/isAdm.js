import { finalPath } from "../paths.js";
const fs = await import('fs');
const path = await import('path');

const dotenv = await import('dotenv');
dotenv.config({ path: finalPath('../.env') });
const sudo_users = process.env.SUDO_USERS;

export function isAdm(member, isSudo=false) {
    const data = JSON.parse(fs.readFileSync(finalPath('../data.json'), 'utf-8'));

    if (data[member.guild.id].adm === undefined) {
        data[member.guild.id].adm = [];
        fs.writeFileSync(finalPath('../data.json'), JSON.stringify(data));
    }

    if (isSudo) {
        return (sudo_users.includes(member.id));
    } else {
        return (data[member.guild.id].adm.includes(member.id) || sudo_users.includes(member.id));
    }
}