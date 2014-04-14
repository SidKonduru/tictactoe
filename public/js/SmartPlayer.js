var SmartPlayer = (function() {
    'use strict';

    var DELIMITER = '|';

    function SmartPlayer(opts) {
        new Player(opts);
        this.id = _.uniqueId('smart');
        this.Q = new Q();
    }

    SmartPlayer.prototype = new Player({
        'isComputer': true
    });

    _.extend(SmartPlayer.prototype, Backbone.Events, {

        start: function() {
            Player.prototype.start.apply(this, arguments);
        },

        onYouLose: function() {
            this.Q.trigger('reward_activity', 'lose');
            Player.prototype.onYouLose.apply(this, arguments);
        },

        onCat: function() {
            this.Q.trigger('reward_activity', 'cat');
            Player.prototype.onCat.apply(this, arguments);
        },

        setSymbol: function(symbol) {
            Player.prototype.setSymbol.apply(this, arguments);
            this.Q.setSymbol(symbol);
        },

        onYouWon: function() {
            this.Q.trigger('reward_activity', 'win');
            Player.prototype.onYouWon.apply(this, arguments);
        },

        play: function(board) {
            var options = _getOptions(board);
            var choice = this.Q.choose(board, options);
            this.trigger('select_square', choice.x, choice.y);
        }
    });


    /////////// helpers
    function _getOptions(board) {
        var options = [];
        var y = board.length;
        while (y--) {
            var x = board[y].length;
            while (x--) {
                if (!board[y][x]) {
                    options.push({
                        'x': x,
                        'y': y
                    });
                }
            }
        }
        return options;
    }

    function _hashBoard(board, mySymbol) {
        // creating hashes of the board, to store as keys for the state info for Q
        // 0 = null, a = me, b = opponent
        return 'h_' + _.map(_.flatten(board), function(symbol) {
            if (!symbol) return 0;
            if (symbol === mySymbol) return 'a';
            return 'b';
        }).join('');
    }

    return SmartPlayer;
})();