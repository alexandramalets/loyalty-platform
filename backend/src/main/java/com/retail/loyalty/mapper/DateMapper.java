package com.retail.loyalty.mapper;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.springframework.stereotype.Component;

import com.retail.loyalty.exception.BadRequestException;

@Component
public class DateMapper {

    public LocalDate parse(String value, String field) {
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException | NullPointerException exception) {
            throw new BadRequestException("Поле «" + field + "» должно быть датой в формате ГГГГ-ММ-ДД");
        }
    }

    public String format(LocalDate value) {
        return value == null ? null : value.toString();
    }
}
