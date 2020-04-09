const Discord = require("discord.js");
const axios = require("axios");
const os = require("os");
const client = new Discord.Client();

var verify = [];

async function confirmcode(uid) {
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
	if(check == false){
		const embed = {
          title: "Error",
          description:
            "**You are already verified or are currently in the process of verifying**",
          color: 16732031
        };
        message.channel.send({ embed });
		return;
	}else{
	var getad = {};
    getad["name"] = message.author.id;
    getad["uid"] = userid;
	getad["code"] = code;
    verify.push(getad);
    const embed = {
      title: "Verify: " + message.author.tag,
      description:
        "**W.I.P**",
      color: 1030394
    };
    message.channel.send({ embed });
	}
  }
  if (command == "confirm") {
    for (var i = 0; i < verify.length; i++) {
      if (verify[i].name == message.author.id) {
        var userid = verify[i].uid;
        confirmcode(userid).then(res => {
          var data = res;
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

client.login(process.env.CLIENT_KEY);
