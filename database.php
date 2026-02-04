<?php
class DatabaseHelper{
    private $db;

    public function __construct($servername, $username, $password, $dbname, $port){
        $this->db = new mysqli($servername, $username, $password, $dbname, $port);
        if ($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        }        
    }

/**
 * @param int $limit è il limite di post da recuperare
 * @param int $offset è l'offset dei post, per caricare altri post successivamente
 * @param string $order è l'ordinamento, valori accettati  "desc" o "asc"
 * @param string $filter è in che modo recuperare i post, gli ordinamenti previsti sono :
 * {all,most_liked,most_commented,my_posts,date}
 * @param int $id è richiesto per reperire i miei post, per gli altri puo essere null
 * 
 * restituisce un array associativo MYSQLI_ASSOC con l'esito della query
 *  */ 

    private function emailExists(string $email): bool
    {
        $sql = "SELECT 1 FROM user WHERE email = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $exists = $stmt->num_rows > 0;
        $stmt->close();
        return $exists;
    }

    public function getPosts(
        int $limit = 10,
        int $offset = 0,
        string $order = 'DESC',
        string $filter = 'all',
        int $id ) {


        $order = strtoupper($order);
        if (!in_array($order, ['ASC', 'DESC'])) {
            $order = 'DESC';
        }

        // Initialize statement
        $stmt = null;

        $result = [
            "data"  => [],
            "error"=> ""
        ];

        try {
            switch ($filter) {
                case 'all':
                    $sql =  "SELECT ".
                            "p.post_id,".
                            "p.titolo,".
                            "p.testo,".
                            "p.data_creazione,".
                            "u.username, ".
                            "COUNT(DISTINCT lp.user_id) AS like_count, ".
                            "COUNT(DISTINCT c.comment_id) AS comment_count ".
                            "FROM Post p ".
                            "JOIN User u ON p.user_id = u.user_id ".
                            "LEFT JOIN Like_Post lp ON p.post_id = lp.post_id ".
                            "LEFT JOIN Comment c ON p.post_id = c.post_id ".
                            "WHERE p.blocked = 0 AND p.inspected = 1 ".
                            "GROUP BY p.post_id ".
                            "ORDER BY p.data_creazione $order ".
                            "LIMIT ? OFFSET ?";
                    
                    $stmt = $this->db->prepare($sql);
                    $stmt->bind_param("ii", $limit, $offset);
                    break;

                case 'most_liked':
                    $sql = "SELECT .".
                            "p.post_id, ".
                            "p.titolo, ".
                            "p.testo, ".
                            "p.data_creazione, ".
                            "u.username, ".
                            "COUNT(lp.user_id) AS like_count ".
                            "FROM Post p ".
                            "JOIN User u ON p.user_id = u.user_id ".
                            "LEFT JOIN Like_Post lp ON p.post_id = lp.post_id ".
                            "WHERE p.blocked = 0 AND p.inspected = 1 ".
                            "GROUP BY p.post_id ".
                            "ORDER BY like_count $order ".
                            "LIMIT ? OFFSET ? ";
                    
                    $stmt = $this->db->prepare($sql);
                    $stmt->bind_param("ii", $limit, $offset);
                    break;

                case 'most_commented':
                    $sql =  "SELECT ".
                            "p.post_id, ".
                            "p.titolo, ".
                            "p.testo, ".
                            "p.data_creazione, ".
                            "u.username, ".
                            "COUNT(c.comment_id) AS comment_count ".
                            "FROM Post p ".
                            "JOIN User u ON p.user_id = u.user_id ".
                            "LEFT JOIN Comment c ON p.post_id = c.post_id ".
                            "WHERE p.blocked = 0 AND p.inspected = 1 ".
                            "GROUP BY p.post_id ".
                            "ORDER BY comment_count $order ".
                            "LIMIT ? OFFSET ? ";
                
                    $stmt = $this->db->prepare($sql);
                    $stmt->bind_param("ii", $limit, $offset);
                    break;

                case 'my_posts':
                    if ($id === null) {
                        throw new Exception("User ID must be provided for 'my_posts' filter.");
                    }
                    $sql =  "SELECT ".
                            "p.post_id,".
                            "p.blocked,".
                            "p.inspected,".
                            "p.titolo,".
                            "p.testo,".
                            "p.data_creazione,".
                            "u.username, ".
                            "COUNT(DISTINCT lp.user_id) AS like_count, ".
                            "COUNT(DISTINCT c.comment_id) AS comment_count ".
                            "FROM Post p ".
                            "JOIN User u ON p.user_id = u.user_id ".
                            "LEFT JOIN Like_Post lp ON p.post_id = lp.post_id ".
                            "LEFT JOIN Comment c ON p.post_id = c.post_id ".
                            "WHERE p.user_id = ? ".
                            "GROUP BY p.post_id ".
                            "ORDER BY p.data_creazione $order ".
                            "LIMIT ? OFFSET ?";
                    
                    $stmt = $this->db->prepare($sql);
                    $stmt->bind_param("iii", $id, $limit, $offset);
                    break;
                                                
                default:
                   throw new Exception("Unknown filter type: $filter");
            }

            $stmt->execute();
            $qresult = $stmt->get_result();
            $result["data"] = $qresult->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

        } catch(Exception $e){ $result["error"] = $e->getMessage();}

        // Execute and fetch
        
        return $result;
    }
    
    public function evalPost($post_id,$blocked){
        $result = [
            "data"  => [],
            "error"=> ""
        ];

        try {
            $query = "UPDATE post ".
                "SET blocked = ? , ".
                "inspected = 1 ".
                "WHERE post_id = ? ";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('ii',$blocked,$post_id);
            $stmt->execute();
        } catch (Exception $e){ $result["error"] = "error";}
                      
        return $result;
    }

    public function getPostById($id){
        $result = [
            "data"  => [],
            "error"=> ""
        ];

        try {
            $query = "SELECT ".
                            "p.post_id,".
                            "p.titolo,".
                            "p.testo,".
                            "p.data_creazione,".
                            "u.username, ".
                            "COUNT(DISTINCT lp.user_id) AS like_count, ".
                            "COUNT(DISTINCT c.comment_id) AS comment_count ".
                            "FROM Post p ".
                            "JOIN User u ON p.user_id = u.user_id ".
                            "LEFT JOIN Like_Post lp ON p.post_id = lp.post_id ".
                            "LEFT JOIN Comment c ON p.post_id = c.post_id ".
                            "WHERE p.post_id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('i',$id);
            $stmt->execute();
            $qresult = $stmt->get_result();
            $result["data"] = $qresult->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e){ $result["error"] = "error";}

        return $result;
    }

    function toggleCommentLike(int $userId, int $commentId): array
    {
        $result = [
            "data"  => null,
            "error"=> null
        ];

        try {
            $checkSql = "
                SELECT 1
                FROM like_comment
                WHERE user_id = ? AND comment_id = ?
                LIMIT 1
            ";

            $stmt = $this->db->prepare($checkSql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("ii", $userId, $commentId);
            $stmt->execute();
            $stmt->store_result();

            $likeExists = $stmt->num_rows > 0;
            $stmt->close();

            if ($likeExists) {
                // REMOVE LIKE
                $sql = "
                    DELETE FROM like_comment
                    WHERE user_id = ? AND comment_id = ?
                ";

                $state = "off"; // OFF
            } else {
                // ADD LIKE
                $sql = "
                    INSERT INTO like_comment (user_id, comment_id)
                    VALUES (?, ?)
                ";

                $state = "on"; // ON
            }

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("ii", $userId, $commentId);
            $stmt->execute();
            $stmt->close();

            $result['data'] = $state;
              
        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return $result;
    }

    function togglePostLike(int $userId, int $postId): array
    {
        $result = [
            "data"  => null,
            "error"=> null
        ];

        try {
            $checkSql = "
                SELECT 1
                FROM Like_Post
                WHERE user_id = ? AND post_id = ?
                LIMIT 1
            ";

            $stmt = $this->db->prepare($checkSql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("ii", $userId, $postId);
            $stmt->execute();
            $stmt->store_result();

            $likeExists = $stmt->num_rows > 0;
            $stmt->close();

            if ($likeExists) {
                // REMOVE LIKE
                $sql = "
                    DELETE FROM Like_Post
                    WHERE user_id = ? AND post_id = ?
                ";

                $state = "off"; // OFF
            } else {
                // ADD LIKE
                $sql = "
                    INSERT INTO Like_Post (user_id, post_id)
                    VALUES (?, ?)
                ";

                $state = "on"; // ON
            }

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("ii", $userId, $postId);
            $stmt->execute();
            $stmt->close();

            $result['data'] = $state;
              
        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }

        return $result;
    }


   /*  ../api-post.php?limit=5&offset=0&order=asc&filter=date&id=0 */
    function getCommentsByPost(
        int $post_id,
        string $order = 'DESC'){
        
        $result = [
            "data"=> [],
            "error"=> ""
        ];
        try {
                // Validate order
            $order = strtoupper($order);
            if (!in_array($order, ['ASC', 'DESC'])) {
                $order = 'ASC';
            }

            $sql = "SELECT ".
                    "c.comment_id, ".
                    "c.contenuto, ".
                    "c.data_creazione, ".
                    "u.username, ".
                    "COUNT(lc.user_id) AS like_count ".
                    "FROM Comment c ".
                    "JOIN User u ON c.user_id = u.user_id ".
                    "LEFT JOIN Like_Comment lc ON c.comment_id = lc.comment_id ".
                    "WHERE c.post_id = ? ".
                    "GROUP BY c.comment_id ".
                    "ORDER BY c.data_creazione $order ";

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->db->error);
            }

            $stmt->bind_param("i", $post_id);
            $stmt->execute();

            $result_q = $stmt->get_result();
            $comments = $result_q->fetch_all(MYSQLI_ASSOC);
            
            $stmt->close();
            $result["data"] = $comments;
            
        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }
        return $result;
    }


    public function getPostByCategory($idcategory){
        $query = "SELECT idarticolo, titoloarticolo, imgarticolo, anteprimaarticolo, dataarticolo, nome FROM articolo, autore, articolo_ha_categoria WHERE categoria=? AND autore=idautore AND idarticolo=articolo";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i',$idcategory);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getPostByIdAndAuthor($id, $idauthor){
        $query = "SELECT idarticolo, anteprimaarticolo, titoloarticolo, imgarticolo, testoarticolo, dataarticolo, (SELECT GROUP_CONCAT(categoria) FROM articolo_ha_categoria WHERE articolo=idarticolo GROUP BY articolo) as categorie FROM articolo WHERE idarticolo=? AND autore=?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ii',$id, $idauthor);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getPostByAuthorId($id){
        $query = "SELECT idarticolo, titoloarticolo, imgarticolo FROM articolo WHERE autore=?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i',$id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function userExists($username){
        $query = "SELECT user_id FROM user WHERE username = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s',$username);
        $stmt->execute();
        $result = $stmt->get_result();
        $result = $result->fetch_all(MYSQLI_ASSOC);
        return count($result) != 0;
    }

    public function checkLogin($username, $password)
    {
        $result = [
            'data'  => [],
            "error"=> ""
        ];
                
        $query = "SELECT user_id, username, password_hash, s_power_user FROM user WHERE username = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s',$username);
        $stmt->execute();
        $result_q = $stmt->get_result();
        $result_q = $result_q->fetch_all(MYSQLI_ASSOC);
        
        //se è stato trovato l'user:
        if(isset($result_q[0]["password_hash"])){
            //controlliamo se la password è corretta
            if(password_verify($password,$result_q[0]["password_hash"])){
                $result['data']["user_id"] = $result_q[0]["user_id"];
                $result['data']["username"] = $result_q[0]["username"];
                $result["data"]["s_power_user"] = $result_q[0]["s_power_user"];
            } else {
                $result['error'] = "dataerror";
            }
        } else {$result['error'] = "err";}

        return $result;
    }    

    public function signInUser(string $username, string $email, string $password): array
    {
        $result = [
            "data"  => [],
            "error" => ""
        ];

        try {
            
            if (trim($username) === '' || trim($email) === '' || trim($password) === '') {
                throw new Exception("invalid_data");
            }

           
            if ($this->userExists($username)) {
                throw new Exception("username_exists");
            }

            if ($this->emailExists($email)) {
                throw new Exception("email_exists");
            }

            $hashedPassword = password_hash($password, PASSWORD_ARGON2ID);
            if ($hashedPassword === false) {
                throw new Exception("internal_error");
            }

            $sql = "
                INSERT INTO user (username, email, password_hash)
                VALUES (?, ?, ?)
            ";

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception("db_error");
            }

            $stmt->bind_param("sss", $username, $email, $hashedPassword);

            if (!$stmt->execute()) {
                throw new Exception("db_error");
            }

            $result["data"] = [
                "user_id" => $this->db->insert_id
            ];

            $stmt->close();

        } catch (Exception $e) {
            $result["error"] = $e->getMessage();
        }

        return $result;
    }


    public function addCommentPost($user_id,$post_id,$text): array
    {
             
        $result = [
            "data"  => [],
            "error" => ""
        ];

        try {

            $text = trim($text);
            if ($text === "") {
                throw new Exception("Comment cannot be empty");
            }

           
            $sql = "
                INSERT INTO Comment (post_id, user_id, contenuto, data_creazione)
                VALUES (?, ?, ?, NOW())
            ";

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("iis", $post_id, $user_id, $text);
            $stmt->execute();
            $post_id = $this->db->insert_id;
            $sql = "SELECT ".
                    "c.comment_id, ".
                    "c.contenuto, ".
                    "c.data_creazione, ".
                    "u.username, ".
                    "COUNT(lc.user_id) AS like_count ".
                    "FROM Comment c ".
                    "JOIN User u ON c.user_id = u.user_id ".
                    "LEFT JOIN Like_Comment lc ON c.comment_id = lc.comment_id ".
                    "WHERE c.comment_id = ? ".
                    "GROUP BY c.comment_id ";

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("i",$post_id);
            $stmt->execute();
            $qresult = $stmt->get_result();
            $qresult = $qresult->fetch_all(MYSQLI_ASSOC);

            $result["data"] = $qresult;

            $stmt->close();

        } catch (Exception $e) {
            $result["error"] = $e->getMessage();
        }

        return $result;
    }

    public function getUserById(int $userId): array
    {
        $result = [
            "data"  => "ciao",
            "error" => ""
        ];

        try {
            $sql ="SELECT u.user_id,".
                "u.username,".
                "u.email,". 
                "u.bio,". 
                "u.created_at,".
                "COUNT(DISTINCT p.post_id) as npost,".
                "COUNT(DISTINCT c.comment_id) as ncomment ".
                "FROM User u ".
                "LEFT JOIN Post p ON u.user_id = p.user_id ".
                "LEFT JOIN Comment c ON u.user_id = c.user_id ".
                "WHERE u.user_id = ? ".
                "Group by user_id ".
                "LIMIT 1 ";
            

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("i", $userId);
            $stmt->execute();

            $res = $stmt->get_result();
            $user = $res->fetch_assoc();

            $stmt->close();

            if (!$user) {
                throw new Exception("User not found");
            }

            $result["data"] = $user;

        } catch (Exception $e) {
            $result["error"] = $e->getMessage();
        }

        return $result;
    }
    
    public function getAdminPage(): array
{
    $result = [
        "data"  => [],
        "error" => ""
    ];

    try {
        // Collect all data
        $result["data"]["blocked_posts"] = $this->getBlockedPosts();
        $result["data"]["reported_posts"] = $this->getReportedPosts();
        $result["data"]["uninspected_posts"] = $this->getUninspectedPosts();
        $result["data"]["most_commented_posts"] = $this->getMostCommentedPosts();
        $result["data"]["stats"] = $this->getAdminStats();

    } catch (Exception $e) {
        $result["error"] = $e->getMessage();
    }

    return $result;
}

private function getBlockedPosts(): array
{
    $sql = "SELECT 
                p.post_id,
                p.titolo,
                p.testo,
                p.data_creazione,
                u.username,
                COUNT(DISTINCT rp.id_progressivo) as report_count
            FROM post p
            JOIN user u ON p.user_id = u.user_id
            LEFT JOIN report_post rp ON p.post_id = rp.post_id
            WHERE p.blocked = 1
            GROUP BY p.post_id
            ORDER BY p.data_creazione DESC";
    
    $result = $this->db->query($sql);
    return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
}

private function getReportedPosts(): array
{
    $sql = "SELECT 
                p.post_id,
                p.titolo,
                p.testo,
                p.blocked,
                p.inspected,
                p.data_creazione,
                u.username,
                COUNT(DISTINCT rp.id_progressivo) as report_count
            FROM post p
            JOIN user u ON p.user_id = u.user_id
            JOIN report_post rp ON p.post_id = rp.post_id
            GROUP BY p.post_id
            HAVING report_count > 0
            ORDER BY report_count DESC";
    
    $result = $this->db->query($sql);
    return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
}

    private function getUninspectedPosts(): array
{
    $sql = "SELECT 
                p.post_id,
                p.titolo,
                p.testo,
                p.data_creazione,
                u.username,
                u.user_id
            FROM post p
            JOIN user u ON p.user_id = u.user_id
            WHERE p.blocked = 0 
              AND p.inspected = 0
            ORDER BY p.data_creazione ASC";
    
    $result = $this->db->query($sql);
    $posts = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    
    return $posts;
}

    private function getMostCommentedPosts(): array
    {
        $sql = "SELECT 
                    p.post_id,
                    p.titolo,
                    p.data_creazione,
                    p.testo,
                    u.username,
                    COUNT(DISTINCT c.comment_id) as comment_count,
                    COUNT(DISTINCT lp.user_id) as like_count
                FROM post p
                JOIN user u ON p.user_id = u.user_id
                LEFT JOIN comment c ON p.post_id = c.post_id
                LEFT JOIN like_post lp ON p.post_id = lp.post_id
                WHERE p.blocked = 0
                GROUP BY p.post_id
                ORDER BY comment_count DESC
                LIMIT 3";
        
        $result = $this->db->query($sql);
        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    private function getAdminStats(): array
    {
        $sql = "SELECT 
                    (SELECT COUNT(*) FROM post) as total_posts,
                    (SELECT COUNT(*) FROM post WHERE blocked = 1) as blocked_posts,
                    (SELECT COUNT(*) FROM post WHERE inspected = 0 AND blocked = 0) as uninspected_posts,
                    (SELECT COUNT(DISTINCT post_id) FROM report_post) as reported_posts,
                    (SELECT COUNT(*) FROM report_post) as total_reports,
                    (SELECT COUNT(*) FROM report_comment) as comment_reports,
                    (SELECT COUNT(*) FROM user) as total_users,
                    (SELECT COUNT(*) FROM user WHERE s_power_user = 1) as admins,
                    (SELECT COUNT(*) FROM comment) as total_comments,
                    (SELECT COUNT(*) FROM post WHERE DATE(data_creazione) = CURDATE()) as posts_today";
        
        $result = $this->db->query($sql);
        return $result ? $result->fetch_assoc() : [];
}
    public function updateUserInfo(int $userId, string $username, string $email, ?string $bio): array
    {
        $result = [
            "data"  => [],
            "error" => ""
        ];

        try {
            
            $sql = "
                UPDATE User
                SET username = ?, email = ?, bio = ?
                WHERE user_id = ?
            ";

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("sssi", $username, $email, $bio, $userId);
            $stmt->execute();

            if ($this->db->errno === 1062) {
                throw new Exception("username or email already exists");
            }

            $stmt->close();

            $result["data"] = "updated";

        } catch (Exception $e) {
            $result["error"] = $e->getMessage();
        }

        return $result;
    }

    public function addPost($user_id,$text){
        $result = [
            "data"  => [],
            "error" => ""
        ];

        try {

            $text = trim($text);
            if ($text === "") {
                throw new Exception("Comment cannot be empty");
            }

           
            $sql = "
                INSERT INTO Post (user_id, testo)
                VALUES (?,?)
            ";

            $stmt = $this->db->prepare($sql);
            if (!$stmt) {
                throw new Exception($this->db->error);
            }

            $stmt->bind_param("is",$user_id, $text);
            $stmt->execute();
            $post_id = $this->db->insert_id;
            $this->getPostById($post_id);

        } catch (Exception $e) {
            $result["error"] = $e->getMessage();
        }

        return $result;
    }

}
?>