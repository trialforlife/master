<?
header('Content-type: text/html; charset=utf-8');
function var_dump_($var){echo "<pre>"; var_dump($var); echo "</pre>"; die();}
function is_assoc ($arr) {
    return (is_array($arr) && (!count($arr) || count(array_filter(array_keys($arr),'is_string')) == count($arr)));
}

try{
    $dbh = new mysqli('localhost', 'root1', 'root1');
    $dbh->select_db('extjs4');
    $dbh->query('set names utf8');
    mysqli_autocommit($dbh, FALSE);
    $table = 'users';
    //deposit update && overdraw update && transfer update
        if ($_GET['act'] == 'update_deposit'  || $_GET['act'] == 'update_over' || $_GET['act'] == 'update_transfer'){
            if ( !isset($_GET['back_dep_select']) || !isset($_GET['balance_plus'])) {$dbh->rollback(); throw new Exception;}
            $Bond = $_GET['back_dep_select'];
            $balance_plus=$_GET['balance_plus'];

            if($_GET['act'] == 'update_deposit'){
                $oper = '+';
            }
            elseif ($_GET['act'] == 'update_over') {
                $oper = '-';
            }
            elseif ($_GET['act'] == 'update_transfer') {
                $oper = '-';
                if ( !isset($_GET['back_dep_select_rec'])) {$dbh->rollback(); throw new Exception;}            
                $Bond1 = $_GET['back_dep_select_rec'];
       
                $result1 = $dbh->query('UPDATE users SET balance = balance + ' .$balance_plus.' WHERE secondName IN ("'.$Bond1.'")');

            }
                $result1 = $dbh->query('UPDATE users SET balance = balance '.$oper.$balance_plus.' WHERE secondName IN ("'.$Bond.'")');
                $dbh->commit();
                $result = $dbh->query('SELECT * FROM '.$table.' WHERE secondName IN ("'.$Bond.'")');
                $json = array();
                while ($row = $result->fetch_assoc()) { $json[] =  $row; }
                echo json_encode(array('names' => $json, 'success' => true));
        }
    
    if ($_GET['act'] != 'read'){
        $json = json_decode(file_get_contents('php://input'), true);
        if (!$json || !isset($json['names'])) throw new Exception();
        if (is_assoc($json['names'])) $json['names'] = array($json['names']);
        $ids = array();
    }


    switch ($_GET['act']){

        case 'create':
            foreach ($json['names'] as $key => $val){
                if (!isset($val['firstName']) || !isset($val['secondName']) || !isset($val['balance'])) { $dbh->rollback(); throw new Exception; }
                $val['firstName']  = $dbh->real_escape_string(strip_tags($val['firstName']));
                $val['secondName'] = $dbh->real_escape_string(strip_tags($val['secondName']));
                $val['balance'] = $dbh->real_escape_string(strip_tags($val['balance']));
                if (empty($val['firstName']) || empty($val['secondName']) || empty($val['balance'])) {
                    $dbh->rollback();
                    throw new Exception;
				}
                $sql ='INSERT INTO users (firstName, secondName, balance) VALUES '
                        ." ('".$val['firstName']."', '".$val['secondName']."','".$val['balance']."' )";
                $dbh->query($sql);
                $ids[] = $dbh->insert_id;
            }
            $result = $dbh->query('SELECT * FROM '.$table.' WHERE id IN ('.implode(',', $ids).')');
            $json = array();
            while ($row = $result->fetch_assoc()) { $json[] =  $row; }
            echo json_encode(array('success' => true, 'names' => $json));
        break;

        case 'read':
            $result = $dbh->query('SELECT id, firstName, secondName, balance FROM '.$table.' ');
            $json = array();
            while ($row = $result->fetch_assoc()) { $json[] =  $row; }
            echo json_encode(array('names' => $json, 'success' => true));
        break;

        case 'update':
            foreach ($json['names'] as $key => $val){
                if (!isset($val['firstName']) && !isset($val['secondName']) && !isset($val['balance'])) {$dbh->rollback(); throw new Exception;}
                $val['firstName']  = $dbh->real_escape_string(strip_tags($val['firstName']));
                $val['secondName'] = $dbh->real_escape_string(strip_tags($val['secondName']));
                $val['balance'] = $dbh->real_escape_string(strip_tags($val['balance']));
                if (empty($val['firstName']) && empty($val['secondName']) && empty($val['balance'])) { $dbh->rollback(); throw new Exception; }
                $sql ='UPDATE users SET ';
                if (!empty($val['firstName'])) $sql .= " firstName = '".$val['firstName']."'";
                if (!empty($val['secondName'])) {
                    if (!empty($val['firstName'])) $sql .= ', ';
                    $sql .= " secondName = '".$val['secondName']."' ";
                }                
                if (!empty($val['balance'])) {
                    if (!empty($val['secondName'])) $sql .= ', ';
                    $sql .= " balance = '".$val['balance']."' ";
                }
                $sql .= " WHERE id = ".((int)$dbh->real_escape_string($val['id']));
                $dbh->query($sql);
                $ids[] = (int)$dbh->real_escape_string($val['id']);
            }
            $result = $dbh->query('SELECT * FROM '.$table.' WHERE id IN ('.implode(',', $ids).')');
            $json = array();
            while ($row = $result->fetch_assoc()) { $json[] =  $row; }
            echo json_encode(array('success' => true, 'names' => $json));
        break;

        case 'delete':
            foreach ($json['names'] as $key => $val){
                if (!isset($val['id'])) throw new Exception;
                $ids[] = (int)$dbh->real_escape_string($val['id']);
            }
            $sql ='DELETE FROM users WHERE id IN ( '.implode(',', $ids).')';
            if (!$dbh->query($sql)) throw new Exception;
            echo json_encode(array('success' => true));
        break;

    }
    $dbh->commit();
} catch (Exception $e){ echo json_encode(array('success' => false)); }
if ($dbh) $dbh->close();
?>
