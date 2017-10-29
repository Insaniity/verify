const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const config = require("./src/config.json");
const token = config.token;
const clientID = config.clientid;
const prefix = config.prefix;
const normalChat = config.chat;
const userRoleID = config.userrole;
const evalPerm = config.evalAllowed;
const owner = config.ownerid;
const streamingGame = config.streamingGame;
const streamingLink = config.streamingLink;
const colors = config.possibleCaptchaColors;
const blockedAccountIDs = config.blockedIDs;
const query = require("./src/Query.json");
// Configuration File: src/config.json

var waitingQueue = [];
var queue = [];
var kicked = [];
client.on("guildMemberAdd", (member) => {
    member.user.send({
        embed: {
            color: 0xffff00,
            description: "Hey dude, we need you to verify before you can interact with people! Just say !verify in #verify"
        }
    });
});


client.on("ready", () => {
    console.log("Right! I'm ready to verify people!")
});

client.on('message', (message) => {
    if (!message.guild) return;
    const verified = message.guild.roles.find(r => r.name === "verified");
    let file = JSON.parse(fs.readFileSync("./src/config.json", "utf8"));
    let queryFile = JSON.parse(fs.readFileSync("./src/Query.json", "utf8"));
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var time = new Date();
    var content = message.content;
    var author = message.author.id;
    if (file.blockedIDs[message.author.id]) {
        if (file.blockedIDs[message.author.id].blocked == "true") {
            message.member.kick();
            console.log(message.member + " was kicked.");
        }
    }
    if (message.author.id != clientID) {
        if (message.content === prefix + "receive" || message.content === prefix + "verify" || message.content === prefix + "captcha") {
            if (message.channel.name === "verify") {
                if (message.member.roles.has(verified)) {
                    message.author.send({
                        embed: {
                            color: 0xff0000,
                            description: "Man, aren't you already verified? wait what??"
                        }
                    });
                } else {
                    var captcha = Math.floor(Math.random() * 9000) + 1001;
                    var floor = Math.floor(Math.random() * 10000) + 1;
                    var jesus = Math.floor(Math.random() * 156251325125) + 125464323514;
                    let webshot = require("webshot");
                    var fontFace, fontSize, fontPosition;
                    if (floor < 5000) {
                        fontFace = "Comic Sans MS";
                    } else if (floor >= 5000) {
                        fontFace = "Arial";
                    }
                    var floorx = Math.floor(Math.random() * 10000) + 1;
                    fontSize = Math.floor(Math.random() * 20) + 35;
                    var height = Math.floor(Math.random() * 20) + 10 + "%";
                    var width = Math.floor(Math.random() * 20) + 10 + "%";
                    var fontColor = colors[Math.floor(Math.random() * 4) + 1];
                    var bgColor = colors[Math.floor(Math.random() * 4) + 1];
                    var rotate = Math.floor(Math.random() * 70) + 11;
                    var letterSpacing = Math.floor(Math.random() * 30) + 10;
                    var boxWidth = Math.floor(Math.random() * 30) + 30;
                    var boxHeight = Math.floor(Math.random() * 30) + 30;
                    var boxColor = colors[Math.floor(Math.random() * 4) + 1];
                    var boxBorderSize = Math.floor(Math.random() * 7) + 1 + "px";
                    var boxMarginTop = Math.floor(Math.random() * 70) + 10 + "%";
                    var boxMarginLeft = Math.floor(Math.random() * 70) + 10 + "%";
                    if (Math.random() > Math.random()) {
                        var rbackup = rotate;
                        rotate -= rbackup;
                        rotate -= rbackup;
                    }
                    if (bgColor === fontColor) {
                        fontColor = colors[Math.floor(Math.random() * 4) + 1];
                    }
                    webshot('<html><body style=\'background-image: url("http://b.reich.io/jjvoab.png");\'><h1 style="font-family:' + fontFace + '; color:' + fontColor + '; font-size:' + fontSize + 'px; position: absolute; top:' + height + ';left:' + width + '; -moz-transform: rotate(' + rotate + 'deg); -ms-transform: rotate(' + rotate + 'deg);-o-transform: rotate(' + rotate + 'deg);-webkit-transform: rotate(' + rotate + 'deg);letter-spacing: ' + letterSpacing + 'px;"><i><del>' + captcha + '</del></i></h1></body></html>', './captchas/HappyHalloween_' + author.username '_ID=!' + jesus + ".png"), {
                        siteType: 'html',
                        screenSize: {
                            width: 500,
                            height: 500
                        }
                    }, function (err) {
                        message.author.send("", {
                            files: ['./captchas/HappyHalloween_' + author.username '_ID=!' + jesus + ".png"]
                        })
                    });
                    setTimeout(function () {
                        fs.unlinkSync('./captchas/HappyHalloween_' + author.username '_ID=!' + jesus + ".png");
                    }, 30000);
                    message.author.send({
                        embed: {
                            color: 0x0000ff,
                            description: "Almost there! Just do `!verify <code>` with the code in the captcha below!\n\n**Made by now you see me#7023 and Krystal ♡#4054**"
                        }
                    });
                    message.delete();

                    queryFile.query[author + "x" + captcha] = {
                        verified: "false"
                    };
                    fs.writeFile("./src/Query.json", JSON.stringify(queryFile));
                    queue.push(author + "x" + captcha);




                    waitingQueue.push(message.author.id);
                    console.log(queue);
                }
            }
        } else if (message.channel.name === "verify" && message.content.includes(prefix + "verify")) {
            var input = message.content.substr(8);
            for (i = 0; i < queue.length; i++) {
                var cpoint = queue[i].indexOf("x");
            }
            cpoint++;
            for (i = 0; i < queue.length; i++) {
                var oldcaptcha = queue[i].substr(cpoint);
            }
            if (input === oldcaptcha) {
                if (message.member.roles.has(verified)) {
                    message.author.send({
                        embed: {
                            color: 0xff0000,
                            description: "Man, aren't you already verified? wait what??"
                        }
                    });
                } else {
                    message.author.send({
                        embed: {
                            color: 0x00ff00,
                            description: "All done! You are now verified, you should be able to access all the public channels!"
                        }
                    });
                    client.channels.find('name', normalChat).send("<@" + message.author.id + "> was successfully verified.\n**Stats**" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "| " + message.author.tag + "(" + message.author.id + ").\n");
                    queryFile.query[message.author.id + "x" + oldcaptcha].verified = "true";
                    queue.pop();
                    fs.appendFileSync("./verify_logs.txt", "[VerifyBot] " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "| " + message.author.tag + "(" + message.author.id + ") verified himself.\n");
                    message.member.addRole(verified).catch(error => console.log(error));
                }

            } else {
                if (message.content.toLowerCase() != prefix + "verify") {
                    message.author.send("Wrong captcha, maybe you used an old one..? Just do !verify in #verify to recieve a new one!");
                    message.delete();
                }
            }
        }
    }
    if (message.content.toLowerCase().startsWith(prefix + "bye")) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.guild.member(message.mentions.users.first()).kick();
        }
    }
    if (message.content.toLowerCase().startsWith(prefix + "blacklist")) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if (!file.blockedIDs[args[0]]) {
                file.blockedIDs[args[0]] = {
                    blocked: "true"
                };
                fs.writeFileSync("./src/config.json", JSON.stringify(file));
                message.channel.send("Added `" + message.content.substr(7) + "` to the blacklist.");
            } else {
                message.channel.send("ID is already blacklisted.");
            }

        } else {
            return message.channel.send("Missing Permissions");
        }
    }
    if (message.content.toLowerCase().startsWith(prefix + "revoke")) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if (file.blockedIDs[args[0]].blocked == "true") {
                file.blockedIDs[args[0]].blocked = "false";
                fs.writeFileSync("./src/config.json", JSON.stringify(file));
                message.channel.send("Successfully revoked the blacklist for `" + args[0] + "`.")
            } else {
                message.channel.send("ID is not blacklisted.");
            }
        } else {
            return message.channel.send("Missing Permissions");
        }
    }

    if (message.content.startsWith(prefix + "clear") && message.content.indexOf("captcha") === "-1") {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.bulkDelete(message.content.substr(7));
        } else {
            return message.channel.send("Missing Permissions");
        }
    }
    if (message.channel.name === "verify") {
        message.delete();
    }
    if (message.author.id === owner && evalPerm === "true" && message.content.startsWith(prefix + "eval")) {
        message.channel.send(":outbox_tray: Output: ```JavaScript\n" + eval(message.content.substr(6)) + "\n```");
    }

});
client.login(config.token);