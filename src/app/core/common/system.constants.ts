export class SystemConstants {
    public static SESSION_KEY_SEARCH_ITEM_MODEL = "SEARCH_ITEM_MODEL";

    public static CURRENT_USER = "CURRENT_USER";
    public static BASE_API = "http://localhost:5000"
    /**
     * Định dạng ngày là YYYY/MM/DD
     */
    public static DATE_MOMENT_YMD_FORMAT_JP = "YYYY/MM/DD";

    /**
     * Định dạng ngày là YYYY/MM/01
     */
    public static DATE_MOMENT_YM01_FORMAT_JP = "YYYY/MM/01";

    /**
     * Định dạng ngày là YYYY/01/01
     */
    public static DATE_MOMENT_Y0101_FORMAT_JP = "YYYY/01/01";

    /**
     * Định dạng ngày là YYYY/MM
     */
    public static DATE_MOMENT_YM_FORMAT_JP = "YYYY/MM";
    /**
     * Định dạng ngày là YYYY
     */
    public static DATE_MOMENT_Y_FORMAT_JP = "YYYY";

    /**
     * Định dạng ngày là yyy/MM/dd
     */
    public static DATE_ANGULAR_YMD_FORMAT_JP = "yyyy/MM/dd";

    /**
     * Đon vị là dollar mỹ USD
     */
    public static ORDER_UNIT_USD = 2;
    /**
     * Đon vị là yên nhật
     */
    public static ORDER_UNIT_YEN = 3;

    /**
     * Đon vị là việt nam đồng
     */
    public static ORDER_UNIT_VND = 1;
}

export class DateRangePickerConfig {
    /**
     * Cấu hình Date mặc định của DateRangePicker
     */
    public static dateOptions: any = {
        locale: { format: SystemConstants.DATE_ANGULAR_YMD_FORMAT_JP },
        showDropdowns: true,
        alwaysShowCalendars: false,
        autoUpdateInput: false,
        singleDatePicker: true
    };
}
