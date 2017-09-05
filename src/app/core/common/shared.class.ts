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

 /**
 * Danh sách các hệ điều hành
 * 
 */

 export class OperationSystem{
    public static OperationSystemLists : any[] = [
        {"id": "Chưa xác định" , "name" : "Chưa xác định"},
        {"id": "Windows 7" , "name" : "Windows 7"},
        {"id": "Windows 8.1" , "name" : "Windows 8.1"},
        {"id": "Windows 10" , "name" : "Windows 10"},
        {"id": "Windows" , "name" : "Windows"},
        {"id": "Linux" , "name" : "Linux"},
        {"id": "Unix" , "name" : "Unix"},
        {"id": "Mac" , "name" : "Mac"}
    ];
 }


 /**
 * Danh sách các ngôn ngữ lập trình
 * 
 */

 export class ProgrammingLanguage{
    public static LanguageLists : any[] = [
        {"id": "Chưa xác định" , "name" : "Chưa xác định"},
        {"id": "C" , "name" : "C"},
        {"id": "C++" , "name" : "C++"},
        {"id": "C#" , "name" : "C#"},
        {"id": "COBOL" , "name" : "COBOL"},
        {"id": "JAVA" , "name" : "JAVA"},
        {"id": "Objective-C" , "name" : "Objective-C"},
        {"id": "Swift" , "name" : "Swift"},
        {"id": "VB6" , "name" : "VB6"},
        {"id": "VB2003" , "name" : "VB2003"},
        {"id": "VB2005" , "name" : "VB2005"},
        {"id": "VB2008" , "name" : "VB2008"},
        {"id": "VB2010" , "name" : "VB2010"},
        {"id": "VB2012" , "name" : "VB2012"},
        {"id": "VB2013" , "name" : "VB2013"},
        {"id": "VB2015" , "name" : "VB2015"},
        {"id": "PYTHON" , "name" : "PYTHON"},
        {"id": "PHP" , "name" : "PHP"}
    ];
 }