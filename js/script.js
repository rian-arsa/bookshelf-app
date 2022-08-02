const books = []
let searchBooks = []
const RENDER_BOOK = 'RENDER_BOOK'
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const formBook = document.getElementById('inputBook');

    formBook.addEventListener('submit', function (e) {
        e.preventDefault();
        manageBook()
        resetForm()
    })

    if (isStorageExist()) {
        loadDataFromStorage();
      }
})

function resetForm() {
    const inputs = document.querySelectorAll('input')
    const checkedInput = document.getElementById('inputBookIsComplete') 

    inputs.forEach(input => {
        input.value = ''
    })
    checkedInput.checked = false
    
}

function manageBook() {
    const id = +new Date()
    const title = document.getElementById('inputBookTitle').value
    const author = document.getElementById('inputBookAuthor').value
    const year = document.getElementById('inputBookYear').value
    let isComplete = document.getElementById('inputBookIsComplete')
    isComplete.checked ? isComplete = true : isComplete = false

    const book = generatedBookObject(id, title, author, year, isComplete)
    books.push(book)

    document.dispatchEvent(new Event(RENDER_BOOK))
    saveData()
}

function generatedBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
      }
}

document.addEventListener('RENDER_BOOK', function() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
    incompleteBookshelfList.innerHTML = ''

    const completeBookshelfList = document.getElementById('completeBookshelfList')
    completeBookshelfList.innerHTML = ''
    
    const search = document.getElementById('searchBookTitle').value
    if(search != '')
    {
        for (const book of searchBooks) {
            if (!book.isComplete) {
                incompleteBookshelfList.append(makeBook(book))
            } else {
                completeBookshelfList.append(makeBook(book))
            }
        }
    } else {
        for (const book of books) {
            if (!book.isComplete) {
                incompleteBookshelfList.append(makeBook(book))
            } else {
                completeBookshelfList.append(makeBook(book))
            }
        }
    }
    // console.log(searchBooks);
    // console.log(books);
        
})


function makeBook(book) {
    const bookTitle = document.createElement('h3')
    bookTitle.innerText = book.title

    const author = document.createElement('p')
    author.innerText = book.author

    const bookYear = document.createElement('p')
    bookYear.innerText = book.year

    const doneButton = document.createElement('button')
    doneButton.classList.add('green')
    if (!book.isComplete) {
        doneButton.innerText = "Selesai dibaca"

        doneButton.addEventListener('click', function () {
            finishedReading(book.id)
        })
    } else {
        doneButton.innerText = "Belum selesai dibaca"

        doneButton.addEventListener('click', function () {
            notFinishedReading(book.id)
        })
    }

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('red')
    deleteButton.innerText = "Hapus Buku"
   deleteButton.addEventListener('click', function () {
        deleteBook(book.id)
   })

    const divAction = document.createElement('div')
    divAction.classList.add('action')
    divAction.append(doneButton, deleteButton)

    const divArticle = document.createElement('div')
    divArticle.classList.add('book_item')
    divArticle.append(bookTitle, author, bookYear, divAction)

    return divArticle
}

function findBook(bookID) {
    for (const book of books) {
        if (book.id == bookID) {
            return book
        }
    }
    return null
}


function findBookIndex(bookID) {
    for (const index in books) {
      if (books[index].id === bookID) {
        return index;
      }
    }
   
    return -1;
  }

function finishedReading(bookID) {
    const book = findBook(bookID)

    if (book == null) {
        return 
    }

    book.isComplete = true
    document.dispatchEvent(new Event(RENDER_BOOK))
    saveData()
}

function notFinishedReading(bookID) {
    const book = findBook(bookID)

    if (book == null) {
        return 
    }

    book.isComplete = false
    document.dispatchEvent(new Event(RENDER_BOOK))
    saveData()
}

function deleteBook(bookID) {
    const bookIndex = findBookIndex(bookID)

    if (bookIndex == -1) {
        return
    }

    books.splice(bookIndex, 1)
    document.dispatchEvent(new Event(RENDER_BOOK))
    saveData()
}

function findBookByTitle(titleBook) {
    searchBooks = []
    for (const book of books) {
        if (book.title.toLowerCase().includes(titleBook)) {
            searchBooks.push(book)
        }
    }
    return searchBooks
}

document.addEventListener('DOMContentLoaded', function () {
    searchBook()
})

function searchBook() {
    const searchBookTitle = document.getElementById('searchBookTitle')

    searchBookTitle.addEventListener('input', function(e) {
       const searchText = searchBookTitle.value.toLowerCase()

    //    console.log(findBookByTitle(searchText));
        findBookByTitle(searchText)
       
        document.dispatchEvent(new Event(RENDER_BOOK))
        
    })
    document.dispatchEvent(new Event(RENDER_BOOK))
}

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
  }

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_BOOK));
  }