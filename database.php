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
                $sql = "SELECT ".
                        "p.post_id, ".
                        "p.titolo, ".
                        "p.testo, ".
                        "p.data_creazione, ".
                        "u.username ".
                    "FROM Post p ".
                    "JOIN User u ON p.user_id = u.user_id ".
                    "WHERE p.user_id = ? ".
                    "ORDER BY p.data_creazione $order ".
                    "LIMIT ? OFFSET ? ";
                
                $stmt = $this->db->prepare($sql);
                $stmt->bind_param("iii", $id, $limit, $offset);
                break;
                                              
            default:
                return(["error" => "Unknown filter type: $filter"]);
        }

        if (!$stmt) {
            return(["error" => "Prepare failed: " . $this->db->error ]);
        }

        // Execute and fetch
        $stmt->execute();
        $result = $stmt->get_result();
        $posts = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        return $posts;
    }


    public function getPostById($id){
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
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    function togglePostLike(int $userId, int $postId): array
    {
        $result = [
            "data"  => null,
            "error"=> null
        ];

        try {
            // 1️⃣ Check if like already exists
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

            // 2️⃣ Toggle
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
        string $order = 'ASC'){
        
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
                
        $query = "SELECT user_id, username, password_hash FROM user WHERE username = ?";
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
            } else {
                $result['error'] = "dataerror";
            }
        } else {$result['error'] = "err";}

        return $result;
    }    

    public function registerUser($username,$password){
        if(!$this->userExists($username)){
            $query = "INSERT INTO user  ".
            "(username, password_hash) VALUES ".
            "(?,?)";

            $stmt = $this->db->prepare($query);
            $hashed_password = password_hash($password,PASSWORD_ARGON2ID);
            if($hashed_password != false){
                $stmt->bind_param('ss',$username,$hashed_password);

                if($stmt->execute()){
                    $result = ["user_id" => $this->db->insert_id];
                } else {
                    $result = ["error" => "baddata"];
                }
            } else {
                $result = ["error" => "internalError"];
            }
            
            
        } else {
            $result = ["error" => "userexists"];
        }
        return $result;
    }


}
?>