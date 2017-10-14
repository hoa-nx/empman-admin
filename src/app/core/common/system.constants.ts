export class SystemConstants {
    public static SESSION_KEY_SEARCH_ITEM_MODEL = "SEARCH_ITEM_MODEL";

    public static CURRENT_USER = "CURRENT_USER";
    public static BASE_API = "http://localhost:5000"
    //public static BASE_API = "http://172.16.8.1"
    public static BASE_WEB = "http://localhost:4200"
 
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

export class AccessRight{
    public static RIGHT_DELETE = "delete";
    public static RIGHT_ADD = "add";
    public static RIGHT_UPDATE = "update";
    public static RIGHT_IMPORT = "import";
    public static RIGHT_EXPORT = "export";
}

export class AccessRightFunctions{
    /**
     * Dữ liệu chung của hệ thống chẳng hạn như master công ty , phòng ban... 
     */
    public static COMPANY = "COMPANY";
    public static COMPANY_RULE = "COMPANY_RULE";
    public static CUSTOMER = "CUSTOMER";
    public static CUSTOMER_UNITPRICE = "CUSTOMER_UNITPRICE";
    public static EXCHANGE_RATE = "EXCHANGE_RATE";
    public static DEPT = "DEPT";
    public static TEAM = "TEAM";
    public static POSITION = "POSITION";
    public static MASTER = "MASTER";
    public static MASTER_DETAIL = "MASTER_DETAIL";
    public static EMP_CARD = "EMP_CARD";
    public static EMP_BASIC = "EMP_BASIC";
    public static EMP_ALLOWANCE = "EMP_ALLOWANCE";
    public static EMP_CONTRACT = "EMP_CONTRACT";
    public static EMP_EXPANDABLE = "EMP_EXPANDABLE";
    public static EMP_TIMELINE = "EMP_TIMELINE";
    public static EMP_WORK = "EMP_WORK";

    public static ERROR = "ERROR";

    public static ESTIMATE = "ESTIMATE";
    public static ORDER_RECEIVED = "ORDER_RECEIVED";
    public static PROJECT = "PROJECT";
    public static PROJECT_DETAIL_LIST = "PROJECT_DETAIL_LIST";
    public static PROJECT_LIST = "PROJECT_LIST";
    public static TARGET_LIST = "TARGET_LIST";
    public static TARGET_EDIT = "TARGET_EDIT";
    public static REVENUE_LIST = "REVENUE_LIST";
    public static REVENUE_EDIT = "REVENUE_EDIT";

    public static RECRUITMENT = "RECRUITMENT";
    public static RECRUITMENT_STAFF = "RECRUITMENT_STAFF";
    public static RECRUITMENT_INTERVIEW = "RECRUITMENT_INTERVIEW";

    public static SEMINAR = "SEMINAR";
    public static SEMINAR_COURSE = "SEMINAR_COURSE";
    public static SEMINAR_RECORD = "SEMINAR_RECORD";

    public static FILE = "FILE";
    public static FILE_EDIT = "FILE_EDIT";
    public static FILE_LIST = "FILE_LIST";

    public static ROLE = "ROLE";
    public static USER = "USER";
    public static FUNCTION = "FUNCTION";
    public static SYSTEM_CONFIG = "SYSTEM_CONFIG";
    public static IMPORT = "IMPORT";
    public static EXPORT = "EXPORT";

    public static STATISTIC = "STATISTIC";
    public static JOB_SCHEDULER = "JOB_SCHEDULER";
}

export class ApllRoles{
    public static MEMBER ="Member";
    public static GENERAL_MANAGER ="GeneralManager";
    public static DIRECTORY_BOARD ="DirectoryBoard";
    public static LEADER ="Leader";
    public static SUBLEADER ="SubLeader";
    public static MANAGER ="Manager";
    public static VICE_MANAGER ="ViceManager";
    public static DEPT_ADMIN ="DeptAdmin" //Tong vu dept
    public static ADMIN ="Admin";
}