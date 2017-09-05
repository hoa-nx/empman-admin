/**
* 10 : Chứng chỉ tiếng Nhật
*11 : Các loại phụ cấp nghiệp vụ
*12 : Các loại phụ cấp phòng chuyên biệt--có kết nối internet
*13 : Các loại phụ cấp phòng chuyên biệt--không có kết nối internet
*14 : Danh sách các trường cao đẳng / đại học
*15 : Các loại phụ cấp BSE
*16 : Các loại phụ cấp qui trình
*17 : Loại hợp đồng lao động
*18 : Loại nhân viên công ty ( ví dụ như lập trình viên, phiên dịch , nhân viên qui trình , tổng vụ ...
*19 : Hệ tốt nghiệp cao nhất ( Cđ/ đại học / cao học)
*20 : Loại báo giá dùng trong báo cáo doanh số 
*21 : Loại xét lương : 6 tháng 1 lần / 1 năm 1 lần...
*22 : Loại onsite : intership / 3 tháng / 6 tháng / 1 năm/ 2 năm...
*23 : Đơn vị tính thời gian onsite( ngày/ tuần / tháng / năm)
*24 : Phân loại dự án ( báo giá / KeepLabor....)
*25 : Đơn vị tiền tệ tính đơn giá hợp đồng với khách hàng OrderUnit
*26 : Loại support  (thực tập / thử việc ...)
*27 : Loại thông báo ví dụ như nhân sự / qui định oniste….
*28 : Nhóm chức vụ.
*29 : kết quả báo giá.
*30 : Loại nhân viên phỏng vấn
 */
export enum MasterKbnEnum {
    /**
     * 10 : Chứng chỉ tiếng Nhật
     */
    JapaneseLevel = 10,
    /**
     * 11 : Các loại phụ cấp nghiệp vụ
     */
    BusinessAllowanceLevel = 11,
    /**
     * 12 : Các loại phụ cấp phòng chuyên biệt--có kết nối internet
     */
    RoomWithInternetAllowanceLevel = 12,
    /**
     * 13 : Các loại phụ cấp phòng chuyên biệt--không có kết nối internet
     */
    RoomNoInternetAllowanceLevel = 13,
    /**
     * 14 : Danh sách các trường cao đẳng / đại học
     */
    CollectNameList = 14,
    /**
     * 15 : Các loại phụ cấp BSE
     */
    BseAllowanceLevel = 15,
    /**
     * 16 : Các loại phụ cấp qui trình
     */
    QAAllowanceLevel = 16,
    /**
     * 17:  Loại hợp đồng lao động
     *  
     */
    ContractType = 17,
    /**
     * 18:  Loại nhân viên
     */
    EmpType = 18,
    /**
     * 19:  Loại bằng cấp (đại học / cao đẳng...)
     */
    EducationLevel = 19,
    /**
     * 20 : Loại báo giá dùng cho báo cáo doanh số
     */
    EstimateType = 20,
    /**
     * 21 : Loại xét lương : 6 tháng 1 lần / 1 năm 1 lần...
     */
    SalaryIncreaseType = 21,
    /**
     * 22 : Loại onsite : intership / 3 tháng / 6 tháng / 1 năm/ 2 năm...
     */
    OnsiteType = 22,
    /**
     * 23 : Đơn vị tính thời gian onsite( ngày/ tuần / tháng / năm)
     */
    TimeUnit = 23,
    /**
     * 24 : Phân loại dự án
     */
    ProjectType = 24,
    /**
     * 25 : Đơn vị tiền tệ tính đơn giá hợp đồng với khách hàng OrderUnit
     */
    OrderUnit = 25,
    /**
     * 
     * 26 : Loại support  (thực tập / thử việc ...)
     */
    SupportType = 26,
    /**
     * 27 : Loại thông báo ví dụ như nhân sự / qui định oniste….
     */
    RuleType = 27,
    /**
     * 28 : Nhóm chức vụ.
     */
    PositionGroup = 28,

    /**
     * Loại nhân viên phỏng vấn
     */
    EstimateResult = 29,

    /**
     * Loại nhân viên phỏng vấn
     */
    RecruitmentType = 30

}

/**
 * Trạng thái data approved
 */
export enum ApprovedStatusEnum {
    /// <summary>
    /// Dữ liệu thông thường
    /// </summary>
    Normal = 0,
    /// <summary>
    /// Dữ liệu đang yêu cầu approved
    /// </summary>
    Request = 1,
    /// <summary>
    /// Từ chối approved
    /// </summary>
    RequestNg = 2,

    /// <summary>
    /// Trưởng nhóm approved
    /// </summary>
    TeamApproved = 10,

    /// <summary>
    /// Dept manager approved
    /// </summary>
    DeptApproved = 15,

    /// <summary>
    /// General magager approved
    /// </summary>
    GeneralDeptApproved = 20,

    /// <summary>
    /// Công ty Approved data ( mức cao nhất )
    /// </summary>
    Approved = 100

}

/**
 * List quyền hạn truy cập 
 */
export enum ActionEnum {
    Create,
    Read,
    Update,
    Delete
}

/**
 *  Phân loại nhóm người dùng trong hệ thống
 */
export enum RoleEnum {
    /// <summary>
    /// Quyền hệ thống (không giới hạn )
    /// </summary>
    Admin,
    /// <summary>
    /// Thành viên ban giám đốc
    /// </summary>
    DirectoryBoard,

    /// <summary>
    /// Manager cấp cao quản lý chung
    /// </summary>
    GeneralManager,

    /// <summary>
    /// Manager
    /// </summary>
    Manager,

    /// <summary>
    /// Phó ban
    /// </summary>
    ViceManager,

    /// <summary>
    /// Trưởng nhóm
    /// </summary>
    Leader,

    /// <summary>
    /// Phó nhóm
    /// </summary>
    SubLeader,

    /// <summary>
    /// Nhân viên
    /// </summary>
    Member
}

/**
 * Trạng thái của các loại dữ liệu
 */
export enum DataStatusEnum {
    /** Dữ liệu trạng thái liên quan đến data phỏng vấn **/

    /** <summary>
     *  Chờ đăng ký phỏng vấn
     */ 
    REC_INTERVIEW_RIGISTER_WAITING = 0,
    /** <summary>
     *  Không đăng ký phỏng vấn
     */ 
    REC_INTERVIEW_UNRIGISTER = 10,

    /** <summary>
     *  Đăng ký phỏng vấn nhưng chưa có lịch phỏng vấn
     */ 
    REC_INTERVIEW_RIGISTER = 20,

    /** <summary>
     *  Chờ phỏng vấn
     */ 
    REC_INTERVIEW_WAITING = 30,
    /** <summary>
     *  Chờ kết quả phỏng vấn
     */
    REC_INTERVIEW_RESULT_WAITING = 40,
    /** <summary>
     *  Phỏng vấn NG hoặc đã tìm được việc
     */
    REC_INTERVIEW_RESULT_NG = 41,

    /** <summary>
     *  Chờ nói chuyện DKLC
     */ 
    REC_INTERVIEW_CONDITION_WORKING_TALK_WAITING = 50,
    /** <summary>
     *  Chờ phản hồi 
     */ 
    REC_INTERVIEW_CONDITION_WORKING_TALK_FEEDBACK = 60,
    /** <summary>
     *  Chờ vào thử việc
     */ 
    REC_INTERVIEW_TRIAL_WAITING = 70,
    /** <summary>
     *  Vào thử việc nhưng chưa đăng ký emp
     */ 
    REC_INTERVIEW_TRIAL = 80,

    /** <summary>
     *  Đang thử việc
     */ 
    REC_INTERVIEW_TRIAL_EMPID_CREATED = 90

    /** Dữ liệu trạng thái liên quan đến data XXXX **/


    /** Dữ liệu trạng thái liên quan đến data XXXX **/

}