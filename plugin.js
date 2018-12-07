const express = require('express');
const Port = require('./lib/port');
const execNode = require('child_process').exec;

const editors = [
    '/Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code',
    '/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl'
];
class Plugin {
    construnctor (opts) {
        this.opts = opts;
    }

    async startServe () {
        this.app = express();
        let port = await Port.port();

        this.app.get('/goto', (req, res) => {
            let filePath = req.query.path;
            execNode(editors.map(editor => `"${editor}" ${filePath}`).join('||'));
            res.json({ res: 'success' });
        });

        this.app.listen(port, () => {
            console.log('\n[goto]:' + port + ' success!!\n');
        });
    }
    async apply (compiler) {
        await this.startServe();
    }
}

module.exports = Plugin;
