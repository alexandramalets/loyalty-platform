package com.retail.loyalty.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "program_settings")
public class ProgramSettings {

    @Id
    private Integer id;

    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(nullable = false)
    private String currency;

    @Column(name = "bonus_unit", nullable = false)
    private String bonusUnit;

    @Column(name = "recalc_period", nullable = false)
    private String recalcPeriod;

    @Column(name = "session_minutes", nullable = false)
    private String sessionMinutes;

    @Column(name = "two_factor", nullable = false)
    private boolean twoFactor;

    @Column(nullable = false)
    private String since;

    @Column(name = "bonus_lifetime", nullable = false)
    private String bonusLifetime;

    @Column(name = "next_recalc", nullable = false)
    private String nextRecalc;

    @Column(name = "notice_system", nullable = false)
    private boolean noticeSystem;

    @Column(name = "notice_email", nullable = false)
    private boolean noticeEmail;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getBonusUnit() {
        return bonusUnit;
    }

    public void setBonusUnit(String bonusUnit) {
        this.bonusUnit = bonusUnit;
    }

    public String getRecalcPeriod() {
        return recalcPeriod;
    }

    public void setRecalcPeriod(String recalcPeriod) {
        this.recalcPeriod = recalcPeriod;
    }

    public String getSessionMinutes() {
        return sessionMinutes;
    }

    public void setSessionMinutes(String sessionMinutes) {
        this.sessionMinutes = sessionMinutes;
    }

    public boolean isTwoFactor() {
        return twoFactor;
    }

    public void setTwoFactor(boolean twoFactor) {
        this.twoFactor = twoFactor;
    }

    public String getSince() {
        return since;
    }

    public void setSince(String since) {
        this.since = since;
    }

    public String getBonusLifetime() {
        return bonusLifetime;
    }

    public void setBonusLifetime(String bonusLifetime) {
        this.bonusLifetime = bonusLifetime;
    }

    public String getNextRecalc() {
        return nextRecalc;
    }

    public void setNextRecalc(String nextRecalc) {
        this.nextRecalc = nextRecalc;
    }

    public boolean isNoticeSystem() {
        return noticeSystem;
    }

    public void setNoticeSystem(boolean noticeSystem) {
        this.noticeSystem = noticeSystem;
    }

    public boolean isNoticeEmail() {
        return noticeEmail;
    }

    public void setNoticeEmail(boolean noticeEmail) {
        this.noticeEmail = noticeEmail;
    }
}
