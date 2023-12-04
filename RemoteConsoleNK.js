script.registerScript({
    name: "RemoteConsoleNK",
    version: "1.0",
    description: "Console in game!",
    website: "https://github.com/Trollhunters501/JSEngineNK/",
    authors: ["Creadores Program & ElectroGamesDev"]
});
var ConfigRCNK;
script.addEventListener("Enable", function(){
    ConfigRCNK = manager.createConfig(manager.getFile("RemoteConsoleNK", "config.yml"), 2);
    if(!ConfigRCNK.get("password")){
        ConfigRCNK.set("password", "ChangeMe");
    }
    ConfigRCNK.save();
    manager.createCommand("console", "Send commands through console", "RemoteConsoleNKcmd", "§cUsage: §a/console <password>", [], "op");
});
function RemoteConsoleNKcmd(sender, args, label){
    let Player = Java.type("cn.nukkit.Player");
    if(sender instanceof Player){
        if(ConfigRCNK.get("password") == "ChangeMe"){
            sender.sendMessage("§cYou must change the password in plugin's config.yml");
            return;
        }
        if(!sender.hasPermission("remoteconsole.password.bypass")){
            if(args.length < 1){
                sender.sendMessage("§cUsage: §a/console <password>");
                return;
            }
            if(args[0] != ConfigRCNK.get("password")){
                sender.sendMessage("§cThe password you entered is incorrect!");
                return;
            }
        }
        let FormWindowCustom = Java.type("cn.nukkit.form.window.FormWindowCustom");
        let ElementInput = Java.type("cn.nukkit.form.element.ElementInput");
        let consoleForm = new FormWindowCustom(
            "§lRemote Console",
            [
                new ElementInput("command", '§rEnter Command (Do not use "/")', "?")
            ]
        );
        sender.showFormWindow(consoleForm);
    }else{
        sender.sendMessage("§cYou must be in-game to use this command!");
    }
}
script.addEventListener("PlayerFormRespondedEvent", function(event){
    let player = event.getPlayer();
    let window = event.getWindow();
    let FormWindowCustom = Java.type("cn.nukkit.form.window.FormWindowCustom");
    if(window instanceof FormWindowCustom){
        if(event.getResponse() == null) return;
        let title = window.getTitle();
        let input = event.getResponse().getInputResponse(0);
        if(!event.wasClosed()){
            if(!title.equals("§lRemote Console")){
                return;
            }
            server.dispatchCommand(server.getConsoleSender(), input);
            player.sendMessage("§aCommand has been executed as console!");
        }
    }
});