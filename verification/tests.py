"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

from string import ascii_lowercase as al
from random import sample, randint, choice, shuffle
from my_solution import halloween_monsters

alx4 = al*4


def make_random_tests(num):
    random_tests = []
    for _ in range(num):
        samp = sample(alx4, randint(15, min(100, len(alx4))))
        shuffle(samp)
        inp = ''.join(samp)
        answer, exp = halloween_monsters(inp)
        random_tests.append({'input': inp,
                             'answer': answer,
                             'explanation': exp})

    return random_tests


TESTS = {
    "Basics": [
        {
            'input': 'casjokthg',
            'answer': 2,
            'explanation': ['jack', 'ghost'],
        },
        {
            'input': 'leumooeeyzwwmmirbmf',
            'answer': 3,
            'explanation': ['mummy', 'zombie', 'werewolf'],
        },
        {
            'input': 'nafrweiicttwneshhtikcn',
            'answer': 3,
            'explanation': ['witch', 'witch', 'frankenstein'],
        },
        {
            'input': 'kenoistcepajmlvre',
            'answer': 2,
            'explanation': ['skeleton', 'vampire'],
        },
        {
            'input': 'miaimavrurymepepv',
            'answer': 2,
            'explanation': ['vampire', 'vampire'],
        },
    ],
    "Extra": [
        {
            'input': "jqfbjivldrcuuapmnvjuhwgozsfsnwualqbnsxrrbvwfzxnpmekafwxhgkxtebtyclqhqmitzhgzkmcyecdpoyddetokip",
            'answer': 9,
            'explanation': ['jack', 'jack', 'ghost', 'ghost', 'vampire', 'witch', 'witch', 'mummy', 'werewolf'],
        },
    ],
    "Randoms": make_random_tests(10),
}
