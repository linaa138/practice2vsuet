package com.example.demo;

import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
import java.sql.Date;

// Импорты твоих таблиц из JOOQ (проверь названия, если они отличаются)
import static jooqdata.tables.Customer.CUSTOMER;
import static jooqdata.tables.Lot.LOT;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Чтобы React с любого порта (3000, 3001) мог достучаться
public class PurchaseController {

    @Autowired
    private DSLContext dsl;

    // 1. ПОЛУЧЕНИЕ ВСЕХ КОНТРАГЕНТОВ
    @GetMapping("/customers")
    public List<Map<String, Object>> getCustomers() {
        return dsl.selectFrom(CUSTOMER)
                .fetch()
                .intoMaps();
    }

    // 2. ДОБАВЛЕНИЕ КОНТРАГЕНТА (Шаг 5 задания)
    @PostMapping("/customers")
    public void addCustomer(@RequestBody Map<String, Object> body) {
        // 1. Смотрим в консоль IDEA - пришло ли хоть что-то?
        System.out.println(">>> ПРИНЯТО С ФРОНТА: " + body);

        try {
            // Извлекаем данные (проверь, что в React имена такие же!)
            String code = String.valueOf(body.getOrDefault("customer_code", ""));
            String name = String.valueOf(body.getOrDefault("customer_name", ""));
            String inn = String.valueOf(body.getOrDefault("customer_inn", ""));
            String kpp = String.valueOf(body.getOrDefault("customer_kpp", ""));
            String pType = String.valueOf(body.getOrDefault("person_type", ""));
            String addr = String.valueOf(body.getOrDefault("postal_address", ""));
            String mail = String.valueOf(body.getOrDefault("email", ""));

            // Вставляем данные, принудительно указывая схему PURCHASE
            dsl.insertInto(org.jooq.impl.DSL.table("purchase.customer"))
                    .set(org.jooq.impl.DSL.field("customer_code"), code)
                    .set(org.jooq.impl.DSL.field("customer_name"), name)
                    .set(org.jooq.impl.DSL.field("customer_inn"), inn)
                    .set(org.jooq.impl.DSL.field("customer_kpp"), kpp)
                    .set(org.jooq.impl.DSL.field("person_type"), pType)
                    .set(org.jooq.impl.DSL.field("postal_address"), addr)
                    .set(org.jooq.impl.DSL.field("email"), mail)
                    .execute();

            System.out.println(">>> УСПЕШНО ЗАПИСАНО В PURCHASE.CUSTOMER");

        } catch (Exception e) {
            System.err.println(">>> ОШИБКА ПРИ ЗАПИСИ: " + e.getMessage());
            e.printStackTrace(); // Выведет красным в консоль, если колонки нет
        }

    }
    // 3. УДАЛЕНИЕ ПО КОДУ (Исправленная версия)
    @DeleteMapping("/customers/{code}")
    public void deleteCustomer(@PathVariable("code") String code) {
        System.out.println("=== ЗАПРОС НА УДАЛЕНИЕ КОДА: " + code + " ===");

        try {
            // Указываем таблицу через DSL.table, чтобы точно попасть в схему purchase
            int deletedRows = dsl.deleteFrom(org.jooq.impl.DSL.table("purchase.customer"))
                    .where(org.jooq.impl.DSL.field("customer_code").eq(code))
                    .execute();

            System.out.println(">>> УДАЛЕНИЕ ЗАВЕРШЕНО. Удалено строк: " + deletedRows);
        } catch (Exception e) {
            System.err.println(">>> ОШИБКА ПРИ УДАЛЕНИИ: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 4. ПОЛУЧЕНИЕ ЛОТОВ
    @GetMapping("/lots")
    public List<Map<String, Object>> getLots() {
        return dsl.resultQuery("SELECT * FROM purchase.lot").fetch().intoMaps();
    }

    // 1. УДАЛЕНИЕ ЛОТА (Исправляем ошибку со скрина)
    @DeleteMapping("/lots/{code}")
    public void deleteLot(@PathVariable("code") String code) {
        try {
            // Прямой SQL запрос — самый надежный
            dsl.execute("DELETE FROM purchase.lot WHERE lot_code = ?", code);
            System.out.println(">>> ЛОТ УДАЛЕН ЧЕРЕЗ SQL: " + code);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 2. ДОБАВЛЕНИЕ ЛОТА
    @PostMapping("/lots")
    public void addLot(@RequestBody Map<String, Object> body) {
        try {
            // Используем максимально простой и экранированный SQL
            dsl.execute(
                    "INSERT INTO \"purchase\".\"lot\" (\"lot_code\", \"lot_name\", \"price\", \"currency\", \"delivery_date\") VALUES (?, ?, ?, ?, ?)",
                    body.get("lot_code"),
                    body.get("lot_name"),
                    new java.math.BigDecimal(body.get("price").toString()),
                    body.get("currency"),
                    java.sql.Date.valueOf(body.get("delivery_date").toString())
            );
            System.out.println(">>> ЛОТ УСПЕШНО ДОБАВЛЕН!");
        } catch (Exception e) {
            System.err.println("ОШИБКА ДОБАВЛЕНИЯ: " + e.getMessage());
            e.printStackTrace();
        }
    }
}