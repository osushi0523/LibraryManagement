package com.example.library.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * クライアントからの書籍登録リクエストを受け取るDTO (Data Transfer Object) です。
 * 
 * 【なぜこの層に書くのか】
 * DBの構造であるEntityと、外部から受け取るリクエストパラメータを分離するためです。
 * また、Spring Validation（@NotBlank 等）を利用してコントローラー受信時に最速で入力チェックを行うために使用します。
 */
public class BookRequest {

    @NotBlank(message = "タイトルは必須です")
    private String title;

    @NotBlank(message = "著者名は必須です")
    private String author;

    public BookRequest() {
    }

    public BookRequest(String title, String author) {
        this.title = title;
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
