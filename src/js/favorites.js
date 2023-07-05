export class Favotites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector ('table tbody')
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    delete(user) {
        const filteredEtries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEtries
        this.update()
    }
}

export  class FavotitesView extends Favotites {
    constructor(root) {
        super(root)

        this.update()
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a p').textContent = user.name
            row.querySelector('.user a span').textContent =user.login
            row.querySelector('.repositories').textContent =user.public_repos
            row.querySelector('.followers').textContent =user.followers

            row.querySelector('.remove').onclick = () => {
                const isOK = confirm('tem certeza que deseja deletar esta linha?')
                if(isOK) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {

        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/SamuelBLuna.png" alt="">
                <a href="https://github.com/SamuelBLuna" target="_blank">
                    <p>Samue Luna</p>
                    <span>SamuelBLuna</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}