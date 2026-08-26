package com.example.library.controller;

import com.example.library.dto.BookRequest;
import com.example.library.entity.Book;
import com.example.library.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 書籍管理のREST APIを提供するControllerクラスです。
 * 
 * 【なぜこの層に書くのか】
 * HTTPリクエストの受付・パス指定（@GetMapping等）・リクエストボディの受け取り・バリデーションチェック、
 * およびレスポンスのHTTPステータスコード設定（200, 201, 400, 404など）を担うためです。
 * 業務ロジック自体はここには書かず、Serviceクラスへ処理を委任します。
 */
@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * GET /books - 全書籍一覧の取得
     */
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.findAll();
        return ResponseEntity.ok(books);
    }

    /**
     * GET /books/{id} - 指定IDの書籍詳細取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        Optional<Book> bookOptional = bookService.findById(id);
        if (bookOptional.isPresent()) {
            return ResponseEntity.ok(bookOptional.get());
        }
        Map<String, String> error = new HashMap<>();
        error.clear();
        error.put("message", "Book not found with id: " + id);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * POST /books - 新規書籍の登録
     */
    @PostMapping
    public ResponseEntity<?> createBook(@Valid @RequestBody BookRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        Book createdBook = bookService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    /**
     * DELETE /books/{id} - 指定IDの書籍削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        boolean deleted = bookService.deleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        Map<String, String> error = new HashMap<>();
        error.put("message", "Book not found with id: " + id);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
