//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function halloweenMonstersCanvas(dom, data) {

            if (! data || ! data.ext) {
                return
            }

            const result = data.ext.result
            const output = data.out
            const input = data.in
            const explanation = data.ext.explanation

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const FONT_SIZE = 15
            const attr = {
                text: {
                    'font-size': FONT_SIZE+'px',
                },
            }

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const C = Math.min(input.length, 20)
            const R = Math.ceil(input.length/20)
            const p_w = C*FONT_SIZE
            const p_h = R*FONT_SIZE+FONT_SIZE/2
            const paper = Raphael(dom, p_w, p_h, 0, 0);

            /*----------------------------------------------*
             *
             * draw
             *
             *----------------------------------------------*/
            let exp_join = explanation.join('')
            let colors = ''
            let c = 1

            for (let o of explanation) {
                c = 1 - c
                colors += c.toString(10).repeat(o.length)
            }

            let letters = []
            input.split('').forEach((a, i)=>{
                const tx = paper.text((i%20)*FONT_SIZE+FONT_SIZE/2,
                            Math.floor(i/20)*FONT_SIZE+FONT_SIZE/2, a).attr(attr.text)
                const idx = exp_join.indexOf(a)
                if (idx > -1) {
                    exp_join = exp_join.slice(0, idx)+' '+exp_join.slice(idx+1)
                    letters.push([tx, i, idx, colors[idx]])
                } else {
                    tx.toBack()
                    letters.push([tx, i, i, 2])
                }
            })

            /*----------------------------------------------*
             *
             * animation
             *
             *----------------------------------------------*/
            if (explanation.length > 0) {
                letters.forEach(([tx, i, idx, c])=>{
                    const [sx, sy] = [i%20, Math.floor(i/20)]
                    const [ex, ey] = [idx%20, Math.floor(idx/20)]
                    tx.animate({'transform': "T " + ((ex-sx)*FONT_SIZE) + "," + ((ey-sy)*FONT_SIZE),
                     'fill': ['#eb6123', '#5f2b93', '#dfe8f7'][c]}, 2000)
                })
            }
        }

        var $tryit;
        var io = new extIO({
            multipleArguments: false,
            functions: {
                python: 'halloween_monsters',
                js: 'halloweenMonsters'
            },
            animation: function($expl, data){
                halloweenMonstersCanvas(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
