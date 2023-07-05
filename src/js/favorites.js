import { GithubUser } from "./GIthubUser.js"

export class Favotites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector ('table tbody')
        this.load()
        this.onadd()
    }
    
    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
    }

    save() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login == username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(error) {
            alert(error.message)
        }
    }
    
    delete(user) {
        const filteredEtries = this.entries.filter(entry => entry.login !== user.login)
        
        this.entries = filteredEtries
        this.update()
        this.save()
    }
}

export  class FavotitesView extends Favotites {
    constructor(root) {
        super(root)
        
        this.update()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            let textInput = this.root.querySelector('#search').value
            this.add(textInput)
            textInput = this.root.querySelector('#search').value =''
        }
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