package com.example.library.repository;

import com.example.library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * データベース（H2）とのCRUD操作を担うRepositoryインターフェースです。
 * 
 * 【なぜこの層に書くのか】
 * データアクセス処理（SQL発行）をSpring Data JPAに委任し、業務ロジック（Service）からDBアクセスの具象実装を隠蔽・抽象化するためです。
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
}
