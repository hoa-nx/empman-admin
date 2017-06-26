export class SystemConstants {
    public static CURRENT_USER = "CURRENT_USER";
    public static BASE_API = "http://localhost:5000"
    public static DATE_FORMAT_JP1 = "YYYY/MM/DD";
    public static DATE_FORMAT_JP2 = "yyyy/MM/dd";
    public static ORDER_UNIT_USD = 2;
    public static ORDER_UNIT_YEN = 3;
    public static ORDER_UNIT_VND = 1;
}

export class DateRangePickerConfig {
    public static dateOptions: any = {
        locale: { format: 'YYYY/MM/01' },
        showDropdowns: true,
        alwaysShowCalendars: false,
        autoUpdateInput: false,
        singleDatePicker: true
    };
}
