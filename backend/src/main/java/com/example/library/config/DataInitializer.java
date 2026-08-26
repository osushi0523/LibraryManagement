package com.example.library.config;

import com.example.library.entity.Book;
import com.example.library.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * アプリケーション起動時にインメモリDB (H2) へサンプルデータを自動投入するコンポーネントです。
 * 
 * 【なぜこの層に書くのか】
 * H2はインメモリDBのため起動時は空です。動作確認用データの登録を起動処理ライフサイクル（CommandLineRunner）に組み込むためです。
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final BookRepository bookRepository;

    public DataInitializer(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            bookRepository.save(new Book("Clean Code", "Robert C. Martin"));
            bookRepository.save(new Book("Effective Java", "Joshua Bloch"));
            bookRepository.save(new Book("Refactoring", "Martin Fowler"));
        }
    }
}
