from copy import deepcopy
from collections import Counter


MONSTERS = '''
jack
ghost
zombie
vampire
witch
mummy
werewolf
skeleton
frankenstein
'''


def halloween_monsters(spell):

    maximum_monsters = []

    def search(rest_spell, rest_monsters, monsters, num=0, max_num=0):

        if not (rest_spell and rest_monsters):
            if num > max_num:
                maximum_monsters.clear()
            if num >= max_num:
                maximum_monsters.append(monsters)
            return max(max_num, num)

        name_monster = rest_monsters[0]
        ct_monster = Counter(name_monster)
        new_spell = deepcopy(rest_spell)
        new_monsters = list(monsters)
        while True:
            max_num = search(new_spell, rest_monsters[1:], new_monsters, num, max_num)
            if ct_monster - new_spell:
                break
            new_spell -= ct_monster
            new_monsters.append(name_monster)
            num += 1

        return max_num

    result = search(Counter(spell), MONSTERS.split(), [])
    return result, maximum_monsters and maximum_monsters[0]


if __name__ == '__main__':
    assert halloween_monsters('mummymummyjack') == (3, ['jack', 'mummy', 'mummy']), 'mummy mummy jack'
