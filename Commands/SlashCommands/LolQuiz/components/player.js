export default 
    class Player {
        constructor(playerId, playerName, avatarURL) {
            this.id = playerId;
            this.name = playerName;
            this.avatar = avatarURL;
            this.correctAnswers = 0;
            this.wrongAnswers = 0;
            this.isFinish = false;
        }
    }