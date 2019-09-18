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
m_list = [ms for ms in MONSTERS.splitlines() if ms]


def halloween_monsters(spell):

    ct_spell = Counter(spell)
    tgt_monsters = [m for m in m_list if not Counter(m) - ct_spell]
    maximum_monsters = []

    def search(rest_spell, rest_monsters, monsters, num=0, max_num=0):

        if not rest_spell or not rest_monsters:
            if num > max_num:
                maximum_monsters.clear()
            if num >= max_num:
                maximum_monsters.append(monsters)
            return max(max_num, num)

        name_monster = rest_monsters[0]
        ct_monster = Counter(name_monster)

        new_spell = deepcopy(rest_spell)
        new_monsters = list(monsters)
        max_num = search(new_spell, rest_monsters[1:], new_monsters, num, max_num)
        while not ct_monster - new_spell:
            new_spell -= ct_monster
            new_monsters.append(name_monster)
            num += 1
            max_num = search(new_spell, rest_monsters[1:], new_monsters, num, max_num)

        return max_num

    result = search(ct_spell, tgt_monsters, [])
    return result, maximum_monsters and maximum_monsters[0]


if __name__ == '__main__':
    assert halloween_monsters('mummymummyjack') == (3, ['jack', 'mummy', 'mummy']), 'mummy mummy jack'
