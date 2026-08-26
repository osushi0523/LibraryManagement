package com.example.library.service;

import com.example.library.dto.BookRequest;
import com.example.library.entity.Book;
import com.example.library.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 書籍管理の業務ロジックを統括するServiceクラスです。
 * 
 * 【なぜこの層に書くのか】
 * HTTPリクエストのハンドリング（Controller）とDBアクセス（Repository）を分離し、
 * トランザクション制御やビジネスルール（エンティティの組み立て、データ検証など）を集約するためです。
 */
@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * 全書籍の一覧を取得します。
     */
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    /**
     * ID指定で書籍を取得します。
     */
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    /**
     * 新しい書籍を登録します。
     */
    @Transactional
    public Book create(BookRequest request) {
        Book book = new Book(request.getTitle(), request.getAuthor());
        return bookRepository.save(book);
    }

    /**
     * ID指定で書籍を削除します。
     */
    @Transactional
    public boolean deleteById(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
