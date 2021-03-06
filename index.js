const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client();

var verify = [];

async function confirmu(uid) {
  const res = await axios.get(`https://bricked.nl/api/desc.php?id=${uid}`);
  if (res.length == 0) {
    return false;
  } else {
    return res.data;
  }
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
      title: "Bricked Help",
      description:
        "**b!start (userid): Start Verifying.\nb!confirm: Confirm the code.\nb!cancel: Cancel Process.**",
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
	confirmu(userid).then(res => {
		if(res.content == "Error"){
			const embed = {
			title: "Error",
			description:
				"**Seems like you used an invalid ID.**",
			color: 16732031
        };
        message.channel.send({ embed });
		return;
		}else{
		    var username = res.user;
			var getad = {};
			var code = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
			getad["name"] = message.author.id;
			getad["uid"] = userid;
			getad["code"] = code;
			verify.push(getad);
			const embed = {
				title: "Verify: " + username,
				description:
					"**Please put this code into your Bio/Desc: "+code+"**",
				color: 1030394
			};
			message.channel.send({ embed });
		}
	})
	}
  }
  if (command == "confirm") {
    for (var i = 0; i < verify.length; i++) {
      if (verify[i].name == message.author.id) {
        var userid = verify[i].uid;
        confirmu(userid).then(res => {
          var data = res.content;
		  var user = res.user;
		  var code = verify[i].code;
		  if(data.indexOf(code) == -1){
			  const embed = {
				title: "Error",
				description:
					"**It seems like you have the wrong code in your bio!**",
				color: 16732031
			  };
			  message.channel.send({ embed });
			  return;
		  }
		  message.member.roles.add("689281307087470628");
		  message.member.setNickname(user);
          const embed = {
            title: "Succesfully Confirmed: " + user,
            description:
              "You have now been granted the Verified role.",
            color: 1030394,
            thumbnail: { url: "https://cdn.bricked.nl/storage/avatars/thumb/"+userid+".png" }
          };
          message.channel.send({ embed });
        });
        break;
      }
    }
  }
  if(command == "cancel"){
	  var check = false;
	  for (var i = 0; i < verify.length; i++) {
		if (verify[i].name == message.author.id) {
			verify.splice(i, 1);
			check = true;
			break;
		}
	  }
	  if(check == true){
		  const embed = {
				title: "Error",
				description:
					"**You are currently not in the process of verifying**",
				color: 16732031
		   };
		   message.channel.send({ embed });
		   return;
	  }
	  const embed = {
            title: "Succesfully cancelled verification",
            description:
              "You have successfully cancelled the verification process.",
            color: 1030394
       };
       message.channel.send({ embed });
  }
});

client.login("Njk3OTI2NTM2MzYzNTA3Nzkz.Xo-Yxg.LtYbPy2pwxrcUyzAgNOkU1APdsk");
