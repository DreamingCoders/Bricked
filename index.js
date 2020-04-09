const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client();

var verify = [];

async function confirmu(uid) {
  const res = await axios.get(`https://bprewritten.net/api/desc.php?id=${uid}`);
  if (res.length == 0) {
    return false;
  } else {
    return res.data.content;
  }
}

function unicodeToChar(text) {
  return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

client.on("ready", () => {
  console.log("I am now active.");
  client.user.setActivity("b!help", { type: "LISTENING" });
});

client.on("message", message => {
  var prefix = "b!";
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;
  if (message.channel.type === "dm") return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command == "help" && message.channel.permissionsFor(client.user).has([ "VIEW_CHANNEL", "SEND_MESSAGES" ])){
	const embed = {
      title: "BPR Help",
      description:
        "**b!start (userid): Start Verifying.\nb!confirm: Confirm the code.**",
      color: 16185871,
      thumbnail: { url: client.user.displayAvatarURL() }
    };
    message.channel.send({ embed });
	return;
  }else if(command && !message.channel.permissionsFor(client.user).has([ "VIEW_CHANNEL", "SEND_MESSAGES" ])){
	  console.log("I couldn't send a message :(");
	  return;
  }
  
  if (command == "start") {
	var check = false;
	var userid = args[0];
    for (var i = 0; i < verify.length; i++) {
      if (verify[i].name == message.author.id) {
		check = true;
        break;
      }
    }
	if(message.member.roles.cache.find(role => role.name === 'Verified')){
		check = true;
	}
	confirmu(userid).then(res => {
		if(res == "Error"){
			check = true;
		}
	})
	if(check == true){
		const embed = {
          title: "Error",
          description:
            "**You are already verified or are currently in the process of verifying.\nThis error can also be caused by an invalid ID.**",
          color: 16732031
        };
        message.channel.send({ embed });
		return;
	}else{
	var getad = {};
	var code = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    getad["name"] = message.author.id;
    getad["uid"] = userid;
	getad["code"] = code;
    verify.push(getad);
    const embed = {
      title: "Verify: " + message.author.tag,
      description:
        "**Please put this code into your Bio/Desc: "+code+"**",
      color: 1030394
    };
    message.channel.send({ embed });
	}
  }
  if (command == "confirm") {
    for (var i = 0; i < verify.length; i++) {
      if (verify[i].name == message.author.id) {
        var userid = verify[i].uid;
        confirmu(userid).then(res => {
          var data = res;
		  var code = verify[i].code;
		  if(data.indexOf(code) == -1){
			  const embed = {
				title: "Error",
				description:
					"**Please run b!start (userid) first!**",
				color: 16732031
			  };
			  message.channel.send({ embed });
			  return;
		  }
          var user = verify[i].name;
          const embed = {
            title: "Succesfully Confirmed: " + message.author.tag,
            description:
              "**W.I.P**",
            color: 1030394,
            thumbnail: { url: "https://bprewritten.net/storage/avatars/thumb/"+userid+".png" }
          };
          message.channel.send({ embed });
        });
        break;
      }
    }
  }
});

client.login("Njk3OTI2NTM2MzYzNTA3Nzkz.Xo-Yxg.LtYbPy2pwxrcUyzAgNOkU1APdsk");
