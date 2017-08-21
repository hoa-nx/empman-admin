/**
 * Nhóm máu
 */
export class BloodGroup
{
    public static BloodGroups : any[] = [
        {"id": "-" , "name" : "Không xác định"},
        {"id": "A", "name" : "Nhóm máu A"},
        {"id": "B" , "name" : "Nhóm máu B"},
        {"id": "AB" , "name" : "Nhóm máu AB"},
        {"id": "O" , "name" : "Nhóm máu O"}
    ];

}

/**
 * Kết quả phỏng vấn
 */
export class InterviewResult
{
    public static InterviewResults : any[] = [
        {"id": "Không chọn phỏng vấn" , "name" : "Không chọn phỏng vấn"},
        {"id": "Không đạt" , "name" : "Không đạt"},
        {"id": "Đạt-nhận thử việc", "name" : "Đạt-nhận thử việc"},
        {"id": "Không tới" , "name" : "Không tới PV"},
        {"id": "Dept khác nhận" , "name" : "Dept khác nhận"},
        {"id": "Đạt-chưa quyết định dept nhận" , "name" : "Đạt-chưa biết dept nhận"},
        {"id": "Đã tìm được việc" , "name" : "Đã tìm được việc"}
    ];

}

/**
 * Danh sách các điều kiện filter dữ liệu
 * 
 */

 export class RecruitConditionDisplay{
    public static RecruitConditionDisplayLists : any[] = [
        {"label": "Không có điều kiện" , "value" : "0"},
        {"label": "Chỉ ứng viên được đăng ký phỏng vấn" , "value" : "1"},
        {"label": "Chỉ ứng viên không được đăng ký PV" , "value" : "2"},
        {"label": "Chỉ ứng viên đạt" , "value" : "3"},
        {"label": "Chỉ ứng viên đạt (dept nhận)" , "value" : "4"},
        {"label": "Chỉ ứng viên đạt (dept # nhận)" , "value" : "5"},
        {"label": "Chỉ ứng viên không đạt" , "value" : "6"},
        {"label": "Chỉ ứng viên đã nói chuyện DKLV" , "value" : "7"},
        {"label": "Chỉ ứng viên đã vào thử việc" , "value" : "8"}
    ];
     
 }