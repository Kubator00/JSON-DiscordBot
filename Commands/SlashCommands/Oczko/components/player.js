module.exports =
    class Player {
        constructor(playerId, playerName, avatarURL) {
            this.id = playerId;
            this.name = playerName;
            this.avatar = avatarURL;
            this.isBot = false;
            this.result = 0;
            this.isFinish = false;
        }
        addResult(number) {
            this.result += number;
        }
        setFinish() {
            this.isFinish = true;
        }
    }