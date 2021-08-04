const { nanoid } = require('nanoid');
const books = require('./books');

const addBooks = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);

    const newBooks = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    if( !name ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if( typeof(year) !== 'number' ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. variabel year hanya menerima type data number',
        });
        response.code(400);
        return response;
    }

    if( typeof(pageCount) !== 'number' ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. variabel pageCount hanya menerima type data number',
        });
        response.code(400);
        return response;
    }

    if( typeof(readPage) !== 'number' ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. variabel readPage hanya menerima type data number',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    books.push(newBooks);

    const isSuccess = books.filter( (book) => book.id === id ).length > 0;
    if( isSuccess ) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooks = (request, h) => {
    const { name, reading, finished } = request.params;
    let booksFiltered = books;

    if( name !== undefined ) {
        booksFiltered = booksFiltered
            .filter( (book) => book.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()) );
    }

    if( reading !== undefined ) {
        booksFiltered = booksFiltered
            .filter( (book) => Number(book.reading) === Number(reading) );
    }

    if( finished !== undefined ) {
        booksFiltered = booksFiltered
            .filter( (book) => Number(book.finished) === Number(finished) );
    }

    const response = h.response({
        status: 'success',
        data: {
            books: books.map( (book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }) ),
        },
    });
    response.code(200);
    return response;
};

const getBookById = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter( (book) => book.id === bookId )[0];

    if( book !== undefined ) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const updateBookById = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = (pageCount === readPage);

    if( !name ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if( typeof(year) !== 'number' ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. variabel year hanya menerima type data number',
        });
        response.code(400);
        return response;
    }

    if( typeof(pageCount) !== 'number' ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. variabel pageCount hanya menerima type data number',
        });
        response.code(400);
        return response;
    }

    if( typeof(readPage) !== 'number' ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. variabel readPage hanya menerima type data number',
        });
        response.code(400);
        return response;
    }

    if( readPage > pageCount ) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const bookIndex = books.findIndex( (book) => book.id === bookId );
    if( bookIndex !== -1 ) {
        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    response.code(404);
    return response;
};

const deleteBookById = (request, h) => {
    const { bookId } = request.params;
    const bookIndex = books.findIndex( (book) => book.id === bookId );
    
    if( bookIndex !== -1 ) {
        books.splice(bookIndex, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addBooks, getAllBooks, getBookById, updateBookById, deleteBookById };