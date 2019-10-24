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
            const BG_COLOR = '#dfe8f7'
            const attr = {
                text: {
                    'font-size': FONT_SIZE+'px',
                },
                scroll: {
                    'stroke-width': '0.2px',
                },
                monster: {
                    'fill': BG_COLOR,
                    'stroke': BG_COLOR,
                    'stroke-width': '0px',
                },
                monster_2: {
                    'fill': '#ababab',
                    'stroke': '#ababab',
                },
                werewolf: {
                    ear: {
                        'fill': BG_COLOR,
                        'stroke': BG_COLOR,
                        'stroke-linejoin': 'round',
                    },
                },
                jack: {
                    parts: {
                        'fill': BG_COLOR,
                        'stroke': BG_COLOR,
                        'stroke-width': '1px',
                        'stroke-linejoin': 'round',
                    }
                },
            }

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const C = Math.min(input.length, 20)
            const R = Math.max(6, Math.ceil(input.length/20))
            const os = 30
            const p_w = C*FONT_SIZE
            const p_h = R*FONT_SIZE
            const paper = Raphael(dom, p_w+os*2, p_h+os*2, 0, 0);
            paper.path(
            ['M', os/2+FONT_SIZE, os*3/4,
            'l', p_w+os-FONT_SIZE*2, 0,
            'a', 10, 10, -270, 1, 1, 10, -10,
            'l', 0, p_h+(os*1/4*2),
            'a', 10, 10, 90, 0, 1, -10, 10,
            'l', -(p_w+os-FONT_SIZE*2), 0,
            'a', 10, 10, -270, 1, 1, -10, 10,
            'l', 0, -(p_h+(os*1/4*2)),
            'a', 10, 10, 90, 0, 1, 10, -10,
            ]).attr(attr.scroll)

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
            let letters_no_use = []
            input.split('').forEach((a, i)=>{
                const tx =  paper.text(
                                (i%20)*FONT_SIZE+FONT_SIZE/2 + os,
                                Math.floor(i/20)*FONT_SIZE+FONT_SIZE/2 + os,
                                a
                            ).attr(attr.text)
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
                letters.forEach(([tx, i, idx, c], n)=>{
                    const [sx, sy] = [i%20, Math.floor(i/20)]
                    const [ex, ey] = [idx%20, Math.floor(idx/20)]
                    tx.animate({'transform': "T " + ((ex-sx)*FONT_SIZE) + "," + ((ey-sy)*FONT_SIZE),
                     'fill': ['#eb6123', '#5f2b93', '#dfe8f7'][c]}, 1500,
                     n === letters.length-1 ? draw_monsters : function(){})
                })
            }

            /*----------------------------------------------*
             *
             * draw monsters
             *
             *----------------------------------------------*/
            function draw_monsters() {
                const input = explanation
                const zoom = .6
                const monsters = {
                    witch: witch,
                    zombie: zombie,
                    vampire: vampire,
                    frankenstein: frankenstein,
                    werewolf: werewolf,
                    mummy: mummy,
                    skeleton: skeleton,
                    jack: jack,
                    ghost: ghost,
                }

                let x = 0
                for (let monster of input) {
                    let elm_ary = []
                    const obj = monsters[monster](zoom)
                    for (let c = 0; c < obj.elements.length; c += 1) {
                        elm_ary.push(obj.elements[c])
                        elm_ary[c].transform(['t',  x+os, os*2+5])
                    }
                    x += obj.width+3
                    elm_ary[0].animate(attr.monster_2, 1000);
                    if (monster === 'jack') {
                        elm_ary[2].animate(attr.monster_2, 1000);
                    }
                }
            }

            /*----------------------------------------------*
             *
             * skeleton
             *
             *----------------------------------------------*/
            function skeleton(z=1) {
                z *=.5
                const s = paper.set()
                const [X, Y] = [20*z, 17*z]

                // head
                s.push(paper.rect(X, Y, 28*z, 28*z, 4*z))
                // body
                s.push(paper.rect(X-20*z, Y+29*z, 70*z, 8*z, 4*z))
                s.push(paper.rect(X+11*z, Y+29*z, 8*z, 70*z, 4*z))
                s.push(paper.rect(X, Y+40*z, 28*z, 8*z, 4*z))
                s.push(paper.rect(X, Y+52*z, 28*z, 8*z, 4*z))
                // arm
                s.push(paper.rect(X-20*z, Y+29*z, 8*z, 70*z, 4*z))
                s.push(paper.rect(X+42*z, Y+29*z, 8*z, 70*z, 4*z))
                // leg
                s.push(paper.rect(X, Y+94*z, 28*z, 8*z, 4*z))
                s.push(paper.rect(X, Y+94*z, 8*z, 70*z, 4*z))
                s.push(paper.rect(X+21*z, Y+94*z, 8*z, 70*z, 4*z))

                s.attr(attr.monster)
                return {elements: [s], width: 70*z}
            }

            /*----------------------------------------------*
             *
             * werewolf
             *
             *----------------------------------------------*/
            function werewolf(z=1) {
                z *=.5
                const ww = paper.set()
                const [X, Y] = [25*z, 17*z]
                // head
                ww.push(paper.rect(X, Y, 28*z, 28*z, 4*z))
                // body
                ww.push(paper.rect(X-25*z, Y+29*z, 80*z, 20*z, 4*z))
                ww.push(paper.rect(X-5*z, Y+29*z, 40*z, 70*z, 4*z))
                // arm
                ww.push(paper.rect(X-25*z, Y+29*z, 18*z, 70*z, 4*z))
                ww.push(paper.rect(X+37*z, Y+29*z, 18*z, 70*z, 4*z))
                // leg
                ww.push(paper.rect(X-5*z, Y+94*z, 19*z, 70*z, 4*z))
                ww.push(paper.rect(X+16*z, Y+94*z, 19*z, 70*z, 4*z))
                // crow
                ww.push(paper.path(['M', X-23*z, Y+(29+70)*z, 'l', 2*z, 7*z, 'l', 2*z, -7*z, 'z']))
                ww.push(paper.path(['M', X-18*z, Y+(29+70)*z, 'l', 2*z, 7*z, 'l', 2*z, -7*z, 'z']))
                ww.push(paper.path(['M', X-13*z, Y+(29+70)*z, 'l', 2*z, 7*z, 'l', 2*z, -7*z, 'z']))
                ww.push(paper.path(['M', X+39*z, Y+(29+70)*z, 'l', 2*z, 7*z, 'l', 2*z, -7*z, 'z']))
                ww.push(paper.path(['M', X+44*z, Y+(29+70)*z, 'l', 2*z, 7*z, 'l', 2*z, -7*z, 'z']))
                ww.push(paper.path(['M', X+49*z, Y+(29+70)*z, 'l', 2*z, 7*z, 'l', 2*z, -7*z, 'z']))
                // ear
                ww.attr(attr.monster)
                ww.push(paper.path(['M', X+3*z, Y, 'l', 2*z, -7*z, 'l', 4*z, 7*z, 'z']).attr(attr.werewolf.ear).attr({'stroke-width': (3*z)+'px'}))
                ww.push(paper.path(['M', X+19*z, Y, 'l', 4*z, -7*z, 'l', 2*z, 7*z, 'z']).attr(attr.werewolf.ear).attr({'stroke-width': (3*z)+'px'}))
                return {elements: [ww], width: 80*z}
            }

            /*----------------------------------------------*
             *
             * frankenstein
             *
             *----------------------------------------------*/
            function frankenstein(z=1) {
                z *= .5
                const f = paper.set()
                const [X, Y] = [25*z, 17*z]
                // head
                f.push(paper.rect(X, Y, 28*z, 28*z, 4*z))
                // body
                f.push(paper.rect(X-25*z, Y+29*z, 80*z, 20*z, 4*z))
                f.push(paper.rect(X-5*z, Y+29*z, 40*z, 70*z, 4*z))
                // arm
                f.push(paper.rect(X-25*z, Y+29*z, 18*z, 70*z, 4*z))
                f.push(paper.rect(X+37*z, Y+29*z, 18*z, 70*z, 4*z))
                // leg
                f.push(paper.rect(X-5*z, Y+94*z, 19*z, 70*z, 4*z))
                f.push(paper.rect(X+16*z, Y+94*z, 19*z, 70*z, 4*z))
                // bolt
                f.push(paper.rect(X-5*z, Y+18*z, 2*z, 6*z))
                f.push(paper.rect(X+31*z, Y+18*z, 2*z, 6*z))
                f.push(paper.rect(X-5*z, Y+20*z, 37*z, 2*z))

                f.attr(attr.monster)
                return {elements: [f], width: 80*z}
            }

            /*----------------------------------------------*
             *
             * vampire
             *
             *----------------------------------------------*/
            function vampire(z=1) {
                z *= .95
                const v = paper.set()
                const [X, Y] = [10*z, 20*z]
                v.push(paper.path(
                    ['M', X, Y,
                    'l', -10*z, 25*z,
                    'l', 10*z, 50*z,
                    'l', 20*z, 0*z,
                    'l', 10*z, -50*z,
                    'l', -10*z, -25*z,
                    'z'
                    ]))
                v.attr(attr.monster)
                return {elements: [v], width: 40*z}
            }

            /*----------------------------------------------*
             *
             * zombie
             *
             *----------------------------------------------*/
            function zombie(z=1) {
                z *= .5
                const zo_0 = paper.set()
                const zo_1 = paper.set()
                const [X, Y] = [35*z, 121*z]
                zo_0.push(paper.circle(X, Y, 30*z))
                zo_0.push(paper.rect(X-30*z, Y, 60*z, 50*z))
                zo_0.push(paper.rect(X-35*z, Y+50*z, 70*z, 10*z))
                zo_0.attr(attr.monster)
                zo_1.push(paper.text(X+0*z, Y+5*z, 'R.I.P.').attr({'font-size': (18*z)+'px', 'fill': BG_COLOR}))
                return {elements: [zo_0, zo_1], width: 70*z}
            }

            /*----------------------------------------------*
             *
             * witch
             *
             *----------------------------------------------*/
            function witch(z=1) {
                z *= .7
                const w = paper.set()
                const [X, Y] = [7*z, 0]
                w.push(paper.rect(X+1*z, Y, 4*z, 80*z))
                w.push(paper.path(
                    ['M', X, Y+80*z,
                    'l', -4*z, 0,
                    'l', 4*z, 10*z,
                    'l', -7*z, 40*z,
                    'l', 6*z, -10*z,
                    'l', 2*z, 10*z,
                    'l', 2*z, -10*z,
                    'l', 2*z, 10*z,
                    'l', 2*z, -10*z,
                    'l', 6*z, 10*z,
                    'l', -7*z, -40*z,
                    'l', 4*z, -10*z,
                    'z'
                    ]))
                w.attr(attr.monster)
                return {elements: [w], width: 20*z}
            }

            /*----------------------------------------------*
             *
             * mummy
             *
             *----------------------------------------------*/
            function mummy(z=1) {
                z *= .5
                const m_0 = paper.set()
                const m_1 = paper.set()
                const [X, Y] = [25*z, 17*z]
                // head
                m_0.push(paper.rect(X, Y, 28*z, 28*z, 4*z))
                // body
                m_0.push(paper.rect(X-25*z, Y+29*z, 80*z, 20*z, 4*z))
                m_0.push(paper.rect(X-5*z, Y+29*z, 40*z, 70*z, 4*z))
                // arm
                m_0.push(paper.rect(X-25*z, Y+29*z, 18*z, 70*z, 4*z))
                m_0.push(paper.rect(X+37*z, Y+29*z, 18*z, 70*z, 4*z))
                // leg
                m_0.push(paper.rect(X-5*z, Y+94*z, 19*z, 70*z, 4*z))
                m_0.push(paper.rect(X+16*z, Y+94*z, 19*z, 70*z, 4*z))
                m_0.attr(attr.monster)
                // bandage
                const bandage = {'stroke-width': (3*z)+'px', 'stroke': BG_COLOR}
                for (let i = 0; i < 3; i += 1) {
                    m_1.push(paper.path(['M', X-25*z, (Y+39*z)+i*(22*z), 'l', 80*z, 0]).attr(bandage))
                }
                for (let i = 3; i < 6; i += 1) {
                    m_1.push(paper.path(['M', X-5*z, (Y+39*z)+i*(22*z), 'l', 40*z, 0]).attr(bandage))
                }
                return {elements: [m_0, m_1], width: 80*z}
            }

            /*----------------------------------------------*
             *
             * ghost
             *
             *----------------------------------------------*/
            function ghost(z=1) {
                z *= .3
                const g_0 = paper.set()
                const g_1 = paper.set()
                const [X, Y] = [56*z, 117*z]
                g_0.push(paper.ellipse(X, Y, 50*z, 55*z))
                g_0.push(paper.rect(X-50*z, Y, 100*z, 150*z))
                g_0.push(paper.path(['M', X-50*z, Y+150*z, 'l', 0, 30*z, 'l', 30*z, -30*z, 'z']))
                g_0.push(paper.path(['M', X+50*z, Y+150*z, 'l', 0, 30*z, 'l', -30*z, -30*z, 'z']))
                g_0.push(paper.path(['M', X-45*z, Y+150*z, 'l', 30*z, 30*z, 'l', 30*z, -30*z, 'z']))
                g_0.push(paper.path(['M', X-15*z, Y+150*z, 'l', 30*z, 30*z, 'l', 30*z, -30*z, 'z']))
                g_0.attr(attr.monster).attr({'stroke-width': (z*10)+'px', 'stroke-linejoin': 'round'})
                // eye
                g_1.push(paper.circle(X-21*z, Y-7*z, 7*z).attr({'fill': BG_COLOR, 'stroke-width': 0}))
                g_1.push(paper.circle(X+21*z, Y-7*z, 7*z).attr({'fill': BG_COLOR, 'stroke-width': 0}))
                return {elements: [g_0, g_1], width: 110*z}
            }

            /*----------------------------------------------*
             *
             * jack
             *
             *----------------------------------------------*/
            function jack(z=1) {
                z *= .25
                const j_0 = paper.set()
                const j_1 = paper.set()
                const j_2 = paper.set()
                const [X, Y] = [50*z, 307*z]
                // body
                j_0.push(paper.rect(X+15*z, Y-70*z, 10*z, 25*z))
                j_0.push(paper.ellipse(X, Y, 50*z, 55*z))
                j_0.push(paper.ellipse(X+20*z, Y, 50*z, 55*z))
                j_0.push(paper.ellipse(X+40*z, Y, 50*z, 55*z))
                j_0.attr(attr.monster)
                // mouth
                j_1.push(paper.path(['M', X-30*z, Y+9*z,
                'c', 20*z, 45*z, 80*z, 45*z, 100*z, 0*z,
                'c', -25*z, 10*z, -70*z, 10*z, -100*z, 0*z,
                'z'
                ]))
                // tooth
                j_2.push(paper.rect(X-11*z, Y+3*z, 14*z, 20*z))
                j_2.push(paper.rect(X+35*z, Y+3*z, 14*z, 20*z))
                j_2.push(paper.rect(X+7*z, Y+39*z, 14*z, 15*z))
                j_2.attr(attr.monster)
                // eye
                j_1.push(paper.path(['M', X-9*z, Y-25*z, 'l', -8*z, 16*z, 'l', 25*z, 4*z, 'z']))
                j_1.push(paper.path(['M', X+47*z, Y-25*z, 'l', -17*z, 20*z, 'l', 25*z, -4*z, 'z']))
                // nose
                j_1.push(paper.path(['M', X+19*z, Y-4*z, 'l', -7*z, 12*z, 'l', 14*z, 0*z, 'z']))
                const face = {'stroke-width': (2*z)+'px'}
                j_1.attr(attr.jack.parts).attr(face)
                return {elements: [j_0, j_1, j_2], width: 140*z}
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
